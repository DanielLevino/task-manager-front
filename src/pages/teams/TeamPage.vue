<template>
  <q-page padding>
    <div class="row items-center q-gutter-sm">
      <div class="text-h6">Minhas equipes</div>
      <q-space />
      <q-btn
        label="Atualizar"
        icon="refresh"
        :loading="loading"
        @click="refresh"
        flat
      />
      <q-btn
        label="Nova equipe"
        color="primary"
        icon="group_add"
        @click="openCreateDialog"
      />
    </div>

    <q-pull-to-refresh @refresh="onPullRefresh">
      <div v-if="teams.length" class="q-mt-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="t in teams" :key="t.id">
            <q-card class="cursor-pointer" flat bordered clickable @click="goToTeam(t.id)" ripple>
              <q-card-section>
                <div class="text-subtitle1 ellipsis">{{ t.name }}</div>
                <div class="text-caption text-grey-7">
                  {{ t.member_role || 'membro' }}
                </div>
              </q-card-section>

              <!-- opcional: um rodapé com um ícone -->
              <q-card-actions align="right">
                <q-btn color="primary" dense aria-label="Abrir">Abrir</q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>

      <div v-else class="q-mt-lg text-grey text-italic">
        Nenhuma equipe encontrada.
      </div>
    </q-pull-to-refresh>

    <q-dialog v-model="createOpen">
      <q-card style="min-width:320px">
        <q-card-section class="text-h6">Criar equipe</q-card-section>
        <q-card-section>
          <q-input v-model="form.name" label="Nome da equipe" dense filled />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" :loading="creating" label="Salvar" @click="handleCreate"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue'
import { useQuasar } from 'quasar'
import { useTeamStore } from 'src/stores/teams'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const teamsStore = useTeamStore()
const router = useRouter()

const loading = computed(() => teamsStore.loading)
const teams = computed(() => teamsStore.items)

async function load() {
  try {
    await teamsStore.fetchTeams()
  } catch (e) {
    $q.notify({ type: 'negative', message: teamsStore.error || 'Falha ao carregar equipes' })
  }
}

onMounted(load)

async function refresh() {
  await load()
  $q.notify({ type: 'positive', message: 'Lista atualizada' })
}

async function onPullRefresh(done) {
  try {
    await load()
  } finally {
    done()
  }
}

const createOpen = ref(false)
const creating = ref(false)
const form = ref({ name: '' })

function openCreateDialog() {
  form.value = { name: '' }
  createOpen.value = true
}

async function handleCreate() {
  if (!form.value.name?.trim()) {
    $q.notify({ type: 'warning', message: 'Informe o nome da equipe' })
    return
  }
  creating.value = true
  try {
    await teamsStore.create({ name: form.value.name.trim() })
    createOpen.value = false
    $q.notify({ type: 'positive', message: 'Equipe criada com sucesso' })
    // não precisa chamar refresh aqui; createTeam já refaz o GET
  } catch (e) {
    $q.notify({ type: 'negative', message: teamsStore.error || 'Erro ao criar equipe' })
  } finally {
    creating.value = false
  }
}
function goToTeam(id) {
  router.push({ name: 'team.show', params: { id } })
}
</script>