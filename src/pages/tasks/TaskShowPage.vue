<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <q-btn flat icon="arrow_back" label="Voltar" @click="$router.back()" />
      <q-space />
      <q-btn color="primary" :to="{ name: 'tasks.edit', params: { id } }" icon="edit" label="Editar" class="q-mr-sm" />
      <q-btn color="negative" icon="delete" label="Excluir" @click="onDelete" />
    </div>

    <q-card>
      <q-inner-loading :showing="loading">
        <q-spinner size="42px" />
      </q-inner-loading>

      <q-card-section v-if="task">
        <div class="text-h6 q-mb-xs">{{ task.title }}</div>
        <div class="text-subtitle2 text-grey-7 q-mb-md">{{ task.description || 'Sem descrição' }}</div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div><b>Status:</b> {{ task.status || '—' }}</div>
            <div><b>Prioridade:</b> {{ task.priority || '—' }}</div>
            <div><b>Vencimento:</b> {{ task.due_date || '—' }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div><b>Criador(a):</b> {{ task.creator?.name || '—' }}</div>
            <div><b>Responsável:</b> {{ task.assignee?.name || '—' }}</div>
            <div><b>Criado em:</b> {{ task.created_at || '—' }}</div>
          </div>
        </div>
      </q-card-section>

      <q-card-section v-if="error" class="text-negative">
        {{ error }}
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

const task = ref(null)
const loading = ref(true)
const error = ref(null)

const load = async () => {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get(`/tasks/${id}`)
    task.value = data
  } catch (e) {
    error.value = e.response?.data?.message || 'Falha ao carregar tarefa'
  } finally {
    loading.value = false
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
