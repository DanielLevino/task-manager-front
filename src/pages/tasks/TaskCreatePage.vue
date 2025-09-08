<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <q-btn flat icon="arrow_back" label="Voltar" @click="$router.back()" />
      <q-space />
      <div class="text-h6">Nova Tarefa</div>
    </div>

    <q-card>
      <q-card-section>
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

          <!-- Opcional: select de responsável (assignee) -->
          <!--
          <q-select v-model="form.assignee_id" :options="assignees" option-value="id" option-label="name" label="Responsável" filled use-input @filter="filterAssignees"/>
          -->

          <div class="row q-gutter-sm">
            <q-btn type="submit" color="primary" label="Salvar" :loading="saving" />
            <q-btn flat color="primary" label="Cancelar" @click="$router.back()" />
          </div>

          <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const $q = useQuasar()
const router = useRouter()

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

const saving = ref(false)
const error = ref(null)

// (Opcional) autocomplete de usuários responsáveis
// const assignees = ref([])
// const filterAssignees = async (val, update) => { ... }

const onSubmit = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  error.value = null
  try {
    const { data } = await api.post('/tasks', form.value)
    $q.notify({ type: 'positive', message: 'Tarefa criada' })
    router.push({ name: 'tasks.show', params: { id: data.id } })
  } catch (e) {
    error.value = e.response?.data?.message || 'Erro ao criar tarefa'
  } finally {
    saving.value = false
  }
}
</script>
