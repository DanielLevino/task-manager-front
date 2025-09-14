<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Header -->
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col-12">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-h6">
              {{ t('dashboard.hello', { name: auth.user?.name || t('user.anonymous') }) }}
            </div>
            <q-space />
            <q-btn
              flat
              icon="refresh"
              :label="t('common.refresh')"
              :loading="loading"
              @click="loadBoard"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- KANBAN -->
    <div class="row q-col-gutter-md">
      <!-- COLUNA: TODO -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-subtitle1">{{ t('tasks.status.todo') }}</div>
            <q-space />
            <q-badge color="grey-8" text-color="white">{{ board.todo.length }}</q-badge>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-sm">
            <q-skeleton v-if="loading" type="rect" height="200px" />
            <draggable
              v-else
              v-model="board.todo"
              group="tasks"
              item-key="id"
              @start="onDragStart('todo', $event)"
              @change="onListChange('todo', $event)"
              class="q-gutter-sm"
            >
              <template #item="{ element }">
                <q-card class="q-pa-sm cursor-pointer" @click="goTask(element.id)">
                  <q-card-section class="q-pa-sm">
                    <div class="text-subtitle2">{{ element.title }}</div>
                    <div class="text-caption text-grey-7">
                      {{ element.due_date ? t('tasks.due', { date: element.due_date }) : t('tasks.noDue') }}
                    </div>
                    <q-chip size="sm" outline :color="priorityColor(element.priority)" class="q-mt-xs">
                      {{ element.priority }}
                    </q-chip>
                  </q-card-section>
                </q-card>
              </template>
              <template #footer>
                <div v-if="!board.todo.length" class="text-grey-6 q-pa-sm">{{ t('tasks.emptyColumn') }}</div>
              </template>
            </draggable>
          </q-card-section>
        </q-card>
      </div>

      <!-- COLUNA: DOING -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-subtitle1">{{ t('tasks.status.doing') }}</div>
            <q-space />
            <q-badge color="grey-8" text-color="white">{{ board.doing.length }}</q-badge>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-sm">
            <q-skeleton v-if="loading" type="rect" height="200px" />
            <draggable
              v-else
              v-model="board.doing"
              group="tasks"
              item-key="id"
              @start="onDragStart('doing', $event)"
              @change="onListChange('doing', $event)"
              class="q-gutter-sm"
            >
              <template #item="{ element }">
                <q-card class="q-pa-sm cursor-pointer" @click="goTask(element.id)">
                  <q-card-section class="q-pa-sm">
                    <div class="text-subtitle2">{{ element.title }}</div>
                    <div class="text-caption text-grey-7">
                      {{ element.due_date ? t('tasks.due', { date: element.due_date }) : t('tasks.noDue') }}
                    </div>
                    <q-chip size="sm" outline :color="priorityColor(element.priority)" class="q-mt-xs">
                      {{ element.priority }}
                    </q-chip>
                  </q-card-section>
                </q-card>
              </template>
              <template #footer>
                <div v-if="!board.doing.length" class="text-grey-6 q-pa-sm">{{ t('tasks.emptyColumn') }}</div>
              </template>
            </draggable>
          </q-card-section>
        </q-card>
      </div>

      <!-- COLUNA: DONE -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-subtitle1">{{ t('tasks.status.done') }}</div>
            <q-space />
            <q-badge color="grey-8" text-color="white">{{ board.done.length }}</q-badge>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-sm">
            <q-skeleton v-if="loading" type="rect" height="200px" />
            <draggable
              v-else
              v-model="board.done"
              group="tasks"
              item-key="id"
              @start="onDragStart('done', $event)"
              @change="onListChange('done', $event)"
              class="q-gutter-sm"
            >
              <template #item="{ element }">
                <q-card class="q-pa-sm cursor-pointer" @click="goTask(element.id)">
                  <q-card-section class="q-pa-sm">
                    <div class="text-subtitle2">{{ element.title }}</div>
                    <div class="text-caption text-grey-7">
                      {{ element.due_date ? t('tasks.due', { date: element.due_date }) : t('tasks.noDue') }}
                    </div>
                    <q-chip size="sm" outline :color="priorityColor(element.priority)" class="q-mt-xs">
                      {{ element.priority }}
                    </q-chip>
                  </q-card-section>
                </q-card>
              </template>
              <template #footer>
                <div v-if="!board.done.length" class="text-grey-6 q-pa-sm">{{ t('tasks.emptyColumn') }}</div>
              </template>
            </draggable>
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
import draggable from 'vuedraggable'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)

const summary = reactive({
  total: 0, todo: 0, doing: 0, done: 0
})

const board = reactive({
  todo: [],
  doing: [],
  done: []
})

// usado para rollback em caso de erro ao persistir
const dragCtx = ref(null)

// Carrega tarefas e preenche colunas
async function loadBoard () {
  loading.value = true
  try {
    const { data } = await api.get('/api/tasks', { params: { per_page: 100, sort: '-created_at' } })
    const items = (data.data || data).map(i => ({
      id: i.id,
      title: i.title,
      status: i.status,          // 'todo' | 'doing' | 'done'
      priority: i.priority,      // 'low' | 'medium' | 'high' (ajuste aos seus valores)
      due_date: i.due_date
    }))

    board.todo  = items.filter(i => i.status === 'todo')
    board.doing = items.filter(i => i.status === 'doing')
    board.done  = items.filter(i => i.status === 'done')

    summary.total = items.length
    summary.todo  = board.todo.length
    summary.doing = board.doing.length
    summary.done  = board.done.length
  } finally {
    loading.value = false
  }
}

function priorityColor (p) {
  if (!p) return 'grey-6'
  const v = String(p).toLowerCase()
  if (v.includes('high') || v === 'alta') return 'negative'
  if (v.includes('medium') || v === 'media' || v === 'média') return 'warning'
  if (v.includes('low') || v === 'baixa') return 'info'
  return 'grey-6'
}

function goTask (id) {
  router.push({ name: 'tasks.show', params: { id } })
}

/** Início do drag: guardo de onde saiu e qual item (para rollback) */
function onDragStart (fromStatus, evt) {
  const idx = evt.oldIndex
  if (idx == null) return
  const task = board[fromStatus][idx]
  dragCtx.value = { fromStatus, fromIndex: idx, task }
}

/** Mudou algo nessa lista (adição/reordenação) */
async function onListChange (targetStatus, evt) {
  // Se veio de outra lista (mudança de status)
  if (evt.added) {
    const task = evt.added.element
    const newIndex = evt.added.newIndex
    await persistTaskStatus(task, targetStatus, newIndex)
    return
  }

  // Reordenou dentro da mesma lista
  if (evt.moved) {
    const task = evt.moved.element
    const newIndex = evt.moved.newIndex
    await persistTaskOrder(task, targetStatus, newIndex)
  }
}

/** Persiste mudança de status (e posição) */
async function persistTaskStatus (task, newStatus, newIndex) {
  const prev = dragCtx.value
  try {
    await api.patch(`/api/tasks/${task.id}`, { status: newStatus, position: newIndex })
    // atualiza KPIs
    summary.todo  = board.todo.length
    summary.doing = board.doing.length
    summary.done  = board.done.length
  } catch (e) {
    // rollback visual
    board[newStatus].splice(newIndex, 1)
    if (prev?.fromStatus) {
      const insertAt = prev.fromIndex ?? board[prev.fromStatus].length
      board[prev.fromStatus].splice(insertAt, 0, task)
    }
  } finally {
    dragCtx.value = null
  }
}

/** (Opcional) Persiste apenas reordenação dentro da mesma coluna */
async function persistTaskOrder (task, status, newIndex) {
  try {
    await api.patch(`/api/tasks/${task.id}`, { status, position: newIndex })
  } catch (e) {
    await loadBoard()
  }
}

onMounted(loadBoard)
</script>

<style scoped>
/* ajuda visual pra área de drop ficar "cheinha" mesmo sem cartões */
.draggable-empty {
  min-height: 120px;
}
</style>
