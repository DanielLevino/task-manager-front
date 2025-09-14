<template>
  <q-card>
    <q-card-section>
      <q-form @submit.prevent="onSubmit" ref="formRef" class="q-gutter-md">
        <q-select
          v-if="teamOptions.length"
          v-model="selectedTeamId"
          :options="teamOptions"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          :label="$t('tasks.fields.teamOptional')"
          filled
          clearable
          :disable="isEdit"
          use-input
          @update:model-value="onTeamChange"
        />

        <q-banner v-if="selectedTeam" class="bg-grey-2 text-grey-9" rounded>
          {{ $t('tasks.form.yourRole') }}:
          <b>{{ $t('teams.roles.' + (selectedTeam.my_role || 'member')) }}</b>.
          <span v-if="canAssignOthers">
            {{ $t('tasks.form.canAssignOthers') }}
          </span>
          <span v-else>{{ $t('tasks.form.youWillBeAssignee') }}</span>
        </q-banner>

        <div v-if="selectedTeam">
          <q-select
            v-if="canAssignOthers"
            v-model="form.assignee_id"
            :options="assigneeOptions"
            option-value="id"
            option-label="name"
            map-options
            emit-value
            :label="$t('tasks.fields.assignee')"
            filled
            :hint="$t('tasks.hints.activeMembersOnly')"
          />
          <q-input
            v-else
            :model-value="auth.user?.name"
            :label="$t('tasks.fields.assignee')"
            filled
            readonly
            :hint="$t('tasks.hints.notAdminWillBeAssignee')"
          />
        </div>

        <q-input
          v-model="form.title"
          :label="$t('tasks.fields.title')"
          :rules="[(v) => !!v || $t('common.required')]"
          filled
        />
        <q-input
          v-model="form.description"
          :label="$t('tasks.fields.description')"
          type="textarea"
          autogrow
          filled
        />

        <div class="row">
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.priority"
              :options="priorityOptions"
              :label="$t('tasks.fields.priority')"
              filled
              emit-value
              map-options
            />
          </div>

          <div class="col-12 col-md-4">
            <q-toggle v-model="isDoing" :label="$t('tasks.form.isDoing')" />
          </div>

          <div class="col-12 col-md-4">
            <q-input v-model="form.due_date" :label="$t('tasks.fields.dueDateShort')" filled readonly>
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.due_date" :mask="dateMask" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-gutter-sm">
          <q-btn
            type="submit"
            color="primary"
            :label="isEdit ? $t('common.saveChanges') : $t('common.save')"
            :loading="saving"
          />
          <q-btn flat color="primary" :label="$t('common.cancel')" @click="onCancel" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { useAuthStore } from 'stores/auth'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const { t: $t, locale } = useI18n({ useScope: 'global' })

const props = defineProps({
  task: { type: Object, default: null }
})
const emit = defineEmits(['saved', 'cancel'])

const $q = useQuasar()
const auth = useAuthStore()

const formRef = ref(null)
const form = ref({
  title: '',
  description: '',
  priority: 'medium',
  due_date: null,
  assignee_id: null,
  team_id: null
})

const isDoing = ref(false)

const priorityOptions = computed(() => ([
  { label: $t('tasks.priority.low'), value: 'low' },
  { label: $t('tasks.priority.medium'), value: 'medium' },
  { label: $t('tasks.priority.high'), value: 'high' }
]))

const selectedTeamId = ref(null)
const selectedTeam = ref(null)
const teamOptions = computed(() =>
  (auth.user?.teams ?? []).map(t => ({ id: t.id, name: t.name }))
)

const saving = ref(false)
const error = ref(null)

const isEdit = computed(() => !!props.task?.id)
const isEN = computed(() => String(locale.value).toLowerCase().startsWith('en'))
const dateMask = computed(() => (isEN.value ? 'MM/DD/YYYY' : 'DD/MM/YYYY'))

// Converte string no formato de EXIBIÇÃO (MM/DD/YYYY ou DD/MM/YYYY) -> ISO (YYYY-MM-DD)
function displayToISO(dateStr) {
  if (!dateStr) return null
  const mask = dateMask.value
  const d = dayjs(dateStr, mask, true) // true = parsing estrito
  return d.isValid() ? d.format('YYYY-MM-DD') : null
}

// Converte ISO (YYYY-MM-DD) -> string no formato de EXIBIÇÃO atual
function isoToDisplay(isoStr) {
  if (!isoStr) return null
  const d = dayjs(isoStr, 'YYYY-MM-DD', true)
  return d.isValid() ? d.format(dateMask.value) : null
}


function hydrateFromTask(task) {
  if (!task) return
  form.value.title = task.title ?? ''
  form.value.description = task.description ?? ''
  form.value.priority = task.priority ?? 'medium'
  form.value.due_date = isoToDisplay(task.due_date) || null
  form.value.assignee_id = task.assignee_id ?? auth.user?.id ?? null
  form.value.team_id = task.team_id ?? null
  isDoing.value = (task.status || '').toLowerCase() === 'doing'
  selectedTeamId.value = form.value.team_id
}

async function onTeamChange (id) {
  selectedTeam.value = null
  form.value.team_id = id || null
  form.value.assignee_id = auth.user?.id ?? null
  if (!id) return
  const { data } = await api.get(`/api/teams/${id}`)
  selectedTeam.value = data
  if (props.task?.assignee_id) {
    form.value.assignee_id = props.task.assignee_id
  }
}

const canAssignOthers = computed(() => {
  const role = (selectedTeam.value?.my_role || '').toLowerCase()
  return role === 'admin' || role === 'creator' || role === 'owner'
})

const assigneeOptions = computed(() => {
  if (!selectedTeam.value?.memberships) return []
  return selectedTeam.value.memberships
    .filter(m => (['owner','admin','member'].includes(m.role)))
    .map(m => ({
      id: m.user?.id || m.id,
      name: m.user?.name || m.name
    }))
})

async function onSubmit() {
  const valid = await formRef.value.validate()
  if (!valid) return

  const payload = {
    title: form.value.title,
    description: form.value.description,
    priority: form.value.priority,
    status: isDoing.value ? 'doing' : 'todo',
    due_date: displayToISO(form.value.due_date),
    assignee_id: form.value.assignee_id ?? auth.user?.id,
    team_id: form.value.team_id ?? null
  }

  saving.value = true
  error.value = null
  try {
    let data
    if (isEdit.value) {
      const res = await api.put(`/api/tasks/${props.task.id}`, payload)
      data = res.data
      $q.notify({ type: 'positive', message: $t('tasks.messages.updated') })
    } else {
      const res = await api.post('/api/tasks', payload)
      data = res.data
      $q.notify({ type: 'positive', message: $t('tasks.messages.created') })
    }
    emit('saved', data)
  } catch (e) {
    error.value = e.response?.data?.message || $t('tasks.errors.save')
  } finally {
    saving.value = false
  }
}

function onCancel() {
  emit('cancel')
}

watch(() => props.task, (t) => {
  form.value = {
    title: '',
    description: '',
    priority: 'medium',
    due_date: null,
    assignee_id: auth.user?.id ?? null,
    team_id: null
  }
  isDoing.value = false
  selectedTeam.value = null
  selectedTeamId.value = null

  if (t) {
    hydrateFromTask(t)
    if (t.team_id) onTeamChange(t.team_id)
  }
}, { immediate: true })

watch(locale, () => {
  // re-renderiza a string exibida (se houver)
  if (form.value.due_date) {
    const iso = displayToISO(form.value.due_date)
    form.value.due_date = isoToDisplay(iso)
  }
})


onMounted(() => {
  if (!props.task && form.value.team_id) {
    onTeamChange(form.value.team_id)
  }
})
</script>
