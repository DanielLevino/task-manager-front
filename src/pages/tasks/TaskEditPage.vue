<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <q-btn flat icon="arrow_back" label="Voltar" @click="$router.back()" />
      <q-space />
      <div class="text-h6">Editar Tarefa</div>
    </div>

    <q-card>
      <q-inner-loading :showing="loading">
        <q-spinner size="42px" />
      </q-inner-loading>

      <q-card-section v-if="!loading">
        <q-form @submit.prevent="onSubmit" ref="formRef" class="q-gutter-md">
          <q-input v-model="form.title" label="Título" :rules="[v => !!v || 'Obrigatório']" filled />
          <q-input v-model="form.description" label="Descrição" type="textarea" autogrow filled />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-select v-model="form.priority" :options="priorityOptions" label="Prioridade" filled />
            </div>
            <div class="col-12 col-md-4">
              <q-select v-model="form.status" :options="statusOptions" label="Status" filled />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="form.due_date" label="Vencimento" filled readonly>
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.due_date" mask="YYYY-MM-DD" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <!-- Opcional: assignee -->
          <!--
          <q-select v-model="form.assignee_id" :options="assignees" option-value="id" option-label="name" label="Responsável" filled use-input @filter="filterAssignees"/>
          -->

          <div class="row q-gutter-sm">
            <q-btn type="submit" color="primary" label="Salvar alterações" :loading="saving" />
            <q-btn flat color="primary" label="Cancelar" @click="$router.back()" />
            <q-space />
            <q-btn color="negative" icon="delete" label="Excluir" @click="onDelete" />
          </div>

          <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const id = route.params.id

const formRef = ref(null)
const form = ref({
  title: '',
  description: '',
  priority: 'medium',
  status: 'open',
  due_date: null,
  assignee_id: null
})

const priorityOptions = ['low', 'medium', 'high']
const statusOptions = ['open', 'in_progress', 'done']

const loading = ref(true)
const saving = ref(false)
const error = ref(null)

// (Opcional) autocomplete de usuários responsáveis
// const assignees = ref([])
// const filterAssignees = async (val, update) => { ... }

const load = async () => {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get(`/tasks/${id}`)
    form.value = {
      title: data.title ?? '',
      description: data.description ?? '',
      priority: data.priority ?? 'medium',
      status: data.status ?? 'open',
      due_date: data.due_date ?? null,
      assignee_id: data.assignee_id ?? null
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Falha ao carregar tarefa'
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  error.value = null
  try {
    await api.put(`/tasks/${id}`, form.value)
    $q.notify({ type: 'positive', message: 'Tarefa atualizada' })
    router.push({ name: 'tasks.show', params: { id } })
  } catch (e) {
    error.value = e.response?.data?.message || 'Erro ao atualizar tarefa'
  } finally {
    saving.value = false
  }
}

const onDelete = () => {
  $q.dialog({
    title: 'Excluir tarefa',
    message: 'Tem certeza que deseja excluir esta tarefa?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/tasks/${id}`)
      $q.notify({ type: 'positive', message: 'Tarefa excluída' })
      router.push({ name: 'tasks.list' })
    } catch (e) {
      $q.notify({ type: 'negative', message: e.response?.data?.message || 'Erro ao excluir' })
    }
  })
}

onMounted(load)
</script>
