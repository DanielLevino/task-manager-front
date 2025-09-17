<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <q-btn flat icon="arrow_back" :label="t('common.back')" @click="$router.back()" />
      <q-space />
      <div>
        <q-btn
          color="primary"
          @click="openModal = true"
          icon="edit"
          :label="t('common.edit')"
          class="q-mr-sm"
        />
        <q-btn
          color="negative"
          icon="delete"
          :label="t('tasks.actions.delete')"
          @click="askDelete(task)"
        />
      </div>
    </div>

    <div class="flex flex-center q-mt-xl">
      <q-card class="size-md q-pa-lg">
        <q-inner-loading :showing="loading">
          <q-spinner size="42px" />
        </q-inner-loading>

        <q-card-section v-if="task">
          <div class="text-h4 q-mb-sm text-center">{{ task.title }}</div>
          <q-separator />
          <div v-if="task.team" class="text-h8 q-my-md">
            <b>{{ t('tasks.fields.team') }}:</b> {{ task.team?.name }}
          </div>

          <div class="text-subtitle2 text-grey-7 q-mb-md">
            {{ task.description || t('tasks.placeholders.noDescription') }}
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div><b>{{ t('tasks.fields.status') }}:</b> {{ task.status || '—' }}</div>
              <div><b>{{ t('tasks.fields.priority') }}:</b> {{ task.priority || '—' }}</div>
              <div>
                <b>{{ t('tasks.fields.dueDateShort') }}:</b>
                {{ task.due_date ? makeDate(task.due_date) : '—' }}
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div><b>{{ t('tasks.fields.creator') }}:</b> {{ task.creator?.name || '—' }}</div>
              <div><b>{{ t('tasks.fields.assignee') }}:</b> {{ task.assignee?.name || '—' }}</div>
              <div>
                <b>{{ t('tasks.fields.createdAt') }}:</b>
                {{ task.created_at ? makeDate(task.created_at) : '—' }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- MODAL EDIT -->
    <q-dialog v-model="openModal" @hide="openModal = false">
      <TaskCreate :task="task" />
    </q-dialog>

    <!-- MODAL DELETE -->
    <q-dialog v-model="deleteDialog.open">
      <q-card class="q-pa-md">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ t('tasks.dialogs.deleteConfirm', { title: deleteDialog.task?.title || t('tasks.single') }) }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn :label="t('common.cancel')" color="primary" v-close-popup />
          <q-btn
            :label="t('tasks.actions.delete')"
            color="negative"
            :loading="deleteDialog.loading"
            @click="confirmDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { api } from 'boot/axios'
import TaskCreate from 'src/components/tasks/TaskCreate.vue'
import dayjs from 'dayjs'

const { t , locale } = useI18n({ useScope: 'global' })
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const id = route.params.id

const task = ref(null)
const loading = ref(true)
const error = ref(null)
const openModal = ref(false)
const deleteDialog = reactive({
  open: false,
  task: null,
  loading: false
})

function askDelete (taskObj) {
  deleteDialog.task = taskObj
  deleteDialog.open = true
}

async function load () {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get(`api/tasks/${id}`)
    task.value = data
  } catch (e) {
    error.value = e.response?.data?.message || t('tasks.errors.loadOne')
    $q.notify({ type: 'negative', message: error.value })
  } finally {
    loading.value = false
  }
}

async function confirmDelete () {
  if (!deleteDialog.task?.id) return
  deleteDialog.loading = true
  try {
    await api.delete(`/api/tasks/${deleteDialog.task.id}`)
    $q.notify({ type: 'positive', message: t('tasks.messages.deletedSuccess') })
    deleteDialog.open = false
    router.push('/')
  } catch (e) {
    $q.notify({ type: 'negative', message: t('tasks.errors.delete') })
  } finally {
    deleteDialog.loading = false
  }
}

function makeDate (date) {
  const format = locale.value === 'pt-BR' ? "DD/MM/YYYY" : "MM/DD/YYYY"
  return dayjs(date).format(format) 
}

onMounted(load)
</script>

<style scoped>
.text-h8 {
  font-size: 1rem;
}
.size-md {
  width: 80vw;
}
</style>
