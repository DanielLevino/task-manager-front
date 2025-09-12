<template>
  <q-page v-if="!loadingOne" padding class="bg-grey-1">
    <!-- Barra de topo (mostrar nome da equipe se já sabemos) -->
    <div class="row items-center q-gutter-sm q-mb-md" v-if="team">
      <q-btn flat round icon="arrow_back" @click="$router.back()" />
      <div class="text-h6">{{ team?.name || 'Equipe' }}</div>
      <q-space />
      <q-btn
        label="Atualizar"
        icon="refresh"
        :loading="loadingOne"
        @click="loadOne"
        flat
      />
    </div>

    <!-- ESTADO: aprovado -->
    <template v-if="status === 'approved'">
      <q-card flat bordered class="q-mt-md">
        <q-card-section>
          <div class="text-h6"><b>Função:</b> {{ team?.my_role || '' }}</div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mt-md">
        <q-card-section>
          <div class="text-h6">Membros: {{ team?.memberships?.length || 0 }}</div>
        </q-card-section>

        <q-card-section>
          <div class="row">
            <div
              v-for="member in team.memberships"
              :key="member.id"
              class="col-12 col-md-4 q-pa-md"
            >
              <q-card class="q-pa-md cursor-pointer" @click="openMemberModal(member)">
                <q-card-section>
                  <div class="text-h6">{{ member.name }}</div>
                  <div class="text-subtitle2 text-grey">{{ member.email }}</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <q-badge color="primary" outline>Função: {{ member.role }}</q-badge>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </template>

    <!-- ESTADO: não é membro -->
    <template v-else-if="status === 'not_member'">
      <div class="flex flex-center" style="min-height: 60vh">
        <q-card class="q-pa-lg q-ma-xl text-center" style="max-width: 420px; width: 100%;">
          <q-card-section>
            <div class="text-h6">Deseja participar desta equipe?</div>
            <div class="text-subtitle2 text-grey">Equipe: {{ team?.name }}</div>
          </q-card-section>
          <q-separator />
          <q-card-actions class="q-mt-md" align="center">
            <q-btn
              color="primary"
              :loading="requesting"
              label="Solicitar participação"
              @click="joinRequest"
            />
          </q-card-actions>
        </q-card>
      </div>
    </template>

    <!-- ESTADO: pendente -->
    <template v-else-if="status === 'pending'">
      <div class="flex flex-center q-mt-xl">
        <q-banner class="q-mb-md q-pa-md bg-yellow-2 text-center" dense rounded inline-actions>
          <template #avatar>
            <q-spinner color="warning" size="md" />
          </template>
          Seu pedido para entrar na equipe <b>{{ team?.name }}</b> está
          <b>aguardando aprovação</b>.
        </q-banner>
      </div>

      <div class="flex flex-center">
        <q-card class="q-pa-lg text-center" style="max-width: 420px; width: 100%;">
          <q-card-section>
            <div class="text-subtitle1">Aguardando aprovação do administrador.</div>
            <div class="text-caption text-grey">
              Você será adicionado à equipe assim que aprovarem.
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>

    <!-- ESTADO: rejeitado -->
    <template v-else-if="status === 'rejected'">
      <div class="flex flex-center q-mt-xl">
        <q-banner class="bg-red-2" rounded inline-actions>
          <template v-slot:avatar>
            <q-icon name="block" color="negative" />
          </template>
          Seu pedido para a equipe <b>{{ team?.name }}</b> foi <b>rejeitado</b>.
        </q-banner>
      </div>

      <div class="flex flex-center" style="min-height: 40vh">
        <q-card class="q-pa-lg text-center" style="max-width: 420px; width: 100%;">
          <q-card-section>
            <div class="text-subtitle1">Não foi possível entrar na equipe.</div>
            <div class="text-caption text-grey">
              Fale com um administrador se você acredita que foi um engano.
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>
    
    <!-- Modal de gerenciamento de membro -->
    <q-dialog v-model="memberDialog.open" persistent>
      <q-card style="min-width: 420px">
        <q-card-section>
          <div class="text-h6">
            Selecione a função para “{{ memberDialog.member?.name }}”
          </div>
          <div class="text-subtitle2 text-grey">
            {{ memberDialog.member?.email }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-select
            v-model="memberDialog.selection"
            :options="roleOptions"
            label="Função"
            filled dense
            emit-value map-options
            :disable="memberDialog.member?.role === 'owner' || savingMember"
            hint="Escolha a nova função ou rejeite o membro"
          />

          <q-banner
            v-if="memberDialog.member?.role === 'owner'"
            rounded class="bg-grey-3 text-grey-9"
          >
            O criador da equipe não pode ter a função alterada.
          </q-banner>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" :disable="savingMember" v-close-popup />
          <q-btn
            color="primary"
            :label="memberDialog.selection"
            :loading="savingMember"
            :disable="memberDialog.member?.role === 'owner'"
            @click="handleSaveMemberRole"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
  <div v-else></div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { useTeamStore } from 'src/stores/teams'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const route = useRoute()
const teamsStore = useTeamStore()
const userStore = useAuthStore()

const teamId = route.params.id
const loadingOne = ref(false)
const requesting = ref(false)

const team = computed(() => teamsStore.current)
const user = computed(() => userStore.user)

// metodo computado para vizualização da página
const status = computed(() => {
  const m = team.value?.member
  const raw = team.value?.approval

  if (m === true) return 'approved'

  const appr = typeof raw === 'string' ? raw.toLowerCase().trim() : raw

  if (appr === 'pending' || appr === 'pendding') return 'pending'
  if (appr === 'rejected') return 'rejected'

  return 'not_member'
})

const roleOptions = [
  { label: 'member', value: 'member' },
  { label: 'admin', value: 'admin' },
  { label: 'rejected', value: 'rejected' }
]
 
const memberDialog = ref({
  open: false,
  member: null,
  selection: null
})

//  ====================================== FUNÇÕES ===========================
/**
 * Carrega dados uma equipe específica através do id na rota
 */
async function loadOne () {
  try {
    loadingOne.value = true
    $q.loading.show()
    await teamsStore.fetchOne({ id: teamId })
  } catch (e) {
    $q.notify({ type: 'negative', message: teamsStore.error || 'Falha ao carregar equipe' })
  } finally {
    loadingOne.value = false
    $q.loading.hide()
  }
}

/**
 * Envia solicitação do para participar da equipe
 */
async function joinRequest () {
  try {
    requesting.value = true
    $q.loading.show()
    await teamsStore.createMember({ teamId, memberId: user.value.id })
    await loadOne()
    $q.notify({ type: 'positive', message: 'Solicitação enviada.' })
  } catch (e) {
    $q.notify({ type: 'negative', message: teamsStore.error || 'Falha ao solicitar participação' })
  } finally {
    requesting.value = false
    $q.loading.hide()
  }
}

/**
 * Abre modal para mudança dos dados do membro da equipe
 * @param member dados do membro da equipe que foi clicado
 */
function openMemberModal (member) {
  console.log(team)
  if(team.value.my_role === "admin" || team.value.my_role === "owner"){
    memberDialog.value.member = member
    memberDialog.value.selection = (member?.status === 'rejected')
      ? 'rejected'
      : (member?.role ?? 'member')
    memberDialog.value.open = true
  } else {
    $q.notify({ type: 'negative', message: 'Não é possível modificar membro. Contacte o criador da equipe.' })
  }
}

/**
 * Salva dados do membro da equipe
 */
async function handleSaveMemberRole () {
  const m = memberDialog.value.member
  const sel = memberDialog.value.selection
  if (!m) return

  try {
    savingMember.value = true
    $q.loading.show()
    
    await teamsStore.updateMembershipRole({
      teamId,
      membershipId: m.id,
      role: sel
    })

    await loadOne()
    memberDialog.value.open = false
    $q.notify({ type: 'positive', message: 'Alterações salvas com sucesso.' })
  } catch (e) {
    $q.notify({ type: 'negative', message: teamsStore.error || 'Falha ao salvar alterações.' })
  } finally {
    savingMember.value = false
    $q.loading.hide()
  }
}

onMounted(loadOne)
</script>
