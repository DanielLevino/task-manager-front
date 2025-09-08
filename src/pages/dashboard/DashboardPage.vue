<template>
  <q-page class="q-pa-md">

    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col-12">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-h6">Olá, {{ auth.user?.name || 'Usuário' }} 👋</div>
            <q-space />
            <q-btn flat icon="refresh" label="Atualizar" :loading="loading" @click="loadSummary" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-6 col-sm-3">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-subtitle2">Total</div>
            <div class="text-h5">{{ summary.total }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6 col-sm-3">
        <q-card>
          <q-card-section>
            <div class="text-subtitle2">A fazer (todo)</div>
            <div class="text-h5">{{ summary.todo }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6 col-sm-3">
        <q-card>
          <q-card-section>
            <div class="text-subtitle2">Em andamento (doing)</div>
            <div class="text-h5">{{ summary.doing }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6 col-sm-3">
        <q-card>
          <q-card-section>
            <div class="text-subtitle2">Concluídas (done)</div>
            <div class="text-h5">{{ summary.done }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-subtitle1">Últimas tarefas</div>
            <q-space />
            <q-select
              v-model="filters.sort"
              :options="sortOptions"
              dense outlined emit-value map-options
              style="min-width: 220px"
              @update:model-value="loadRecent"
            />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-skeleton v-if="loading" type="table" />
            <q-list v-else bordered separator>
              <q-item v-for="t in recent" :key="t.id">
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ t.title }}</q-item-label>
                  <q-item-label caption>
                    {{ t.status.toUpperCase() }} • Prioridade: {{ t.priority }} •
                    {{ t.due_date ? 'Entrega: ' + t.due_date : 'Sem prazo' }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-btn flat dense icon="open_in_new" @click="goTask(t.id)" title="Abrir" />
                </q-item-section>
              </q-item>

              <div v-if="!recent.length && !loading" class="text-grey q-pa-md">
                Nenhuma tarefa encontrada.
              </div>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { api } from 'boot/axios'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const summary = reactive({
  total: 0, todo: 0, doing: 0, done: 0
})
const recent = ref([])

const filters = reactive({
  sort: '-created_at'
})

const sortOptions = [
  { label: 'Mais recentes', value: '-created_at' },
  { label: 'Mais antigos', value: 'created_at' },
  { label: 'Prazo mais próximo', value: 'due_date' },
  { label: 'Prazo mais distante', value: '-due_date' }
]

async function loadSummary () {
  loading.value = true
  try {
    // busca um “lote” e agrega no cliente (simples para começar)
    const { data } = await api.get('/api/tasks', { params: { per_page: 100, sort: '-created_at' } })
    const items = data.data || data // paginate do Laravel: data.data
    summary.total = items.length
    summary.todo  = items.filter(i => i.status === 'todo').length
    summary.doing = items.filter(i => i.status === 'doing').length
    summary.done  = items.filter(i => i.status === 'done').length
  } finally {
    loading.value = false
  }
}

async function loadRecent () {
  loading.value = true
  try {
    const { data } = await api.get('/api/tasks', { params: { per_page: 10, sort: filters.sort } })
    console.log(data.data)
    recent.value = (data.data || data).map(i => ({
      id: i.id,
      title: i.title,
      status: i.status,
      priority: i.priority,
      due_date: i.due_date
    }))
  } finally {
    loading.value = false
  }
}

function goTask (id) {
  router.push({ name: 'tasks', query: { id } }) 
}

onMounted(async () => {
  await Promise.all([loadSummary(), loadRecent()])
})
</script>
