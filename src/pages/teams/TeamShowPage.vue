<template>
  <q-page v-if="!loadingOne" padding class="bg-grey-1">
    <!-- Top bar -->
    <div class="row items-center q-gutter-sm q-mb-md" v-if="team">
      <q-btn flat round icon="arrow_back" @click="$router.back()" />
      <div class="text-h6">{{ team?.name || $t('teams.single') }}</div>
      <q-space />
      <q-btn
        :label="$t('common.refresh')"
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
          <div class="text-h6">
            <b>{{ $t('teams.fields.role') }}:</b>
            {{ $t('teams.roles.' + (team?.my_role || 'member')) }}
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mt-md">
        <q-card-section>
          <div class="text-h6">
            {{ $t('teams.members') }}: {{ team?.memberships?.length || 0 }}
          </div>
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
                  <q-badge color="primary" outline>
                    {{ $t('teams.fields.role') }}:
                    {{ $t('teams.roles.' + (member.role || 'member')) }}
                  </q-badge>
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
            <div class="text-h6">{{ $t('teams.join.ask') }}</div>
            <div class="text-subtitle2 text-grey">
              {{ $t('teams.join.teamLabel', { name: team?.name }) }}
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions class="q-mt-md" align="center">
            <q-btn
              color="primary"
              :loading="requesting"
              :label="$t('teams.join.requestButton')"
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
          {{ $t('teams.join.pendingBanner', { name: team?.name }) }}
        </q-banner>
      </div>

      <div class="flex flex-center">
        <q-card class="q-pa-lg text-center" style="max-width: 420px; width: 100%;">
          <q-card-section>
            <div class="text-subtitle1">{{ $t('teams.join.pendingTitle') }}</div>
            <div class="text-caption text-grey">
              {{ $t('teams.join.pendingHint') }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>

    <!-- ESTADO: rejeitado -->
    <template v-else-if="status === 'rejected'">
      <div class="flex flex-center q-mt-xl">
        <q-banner class="bg-red-2" rounded inline-actions>
          <template #avatar>
            <q-icon name="block" color="negative" />
          </template>
          {{ $t('teams.join.rejectedBanner', { name: team?.name }) }}
        </q-banner>
      </div>

      <div class="flex flex-center" style="min-height: 40vh">
        <q-card class="q-pa-lg text-center" style="max-width: 420px; width: 100%;">
          <q-card-section>
            <div class="text-subtitle1">{{ $t('teams.join.rejectedTitle') }}</div>
            <div class="text-caption text-grey">
              {{ $t('teams.join.rejectedHint') }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>

    <!-- Modal de gerenciamento de membro -->
    <q-dialog v-model="memberDialog.open" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">
            {{ $t('teams.modals.selectRoleTitle', { name: memberDialog.member?.name }) }}
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
            :label="$t('teams.fields.role')"
            filled dense
            emit-value map-options
            :disable="memberDialog.member?.role === 'owner' || savingMember"
            :hint="$t('teams.hints.chooseRole')"
          />

          <q-banner
            v-if="memberDialog.member?.role === 'owner'"
            rounded class="bg-grey-3 text-grey-9"
          >
            {{ $t('teams.modals.ownerLocked') }}
          </q-banner>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('common.cancel')" :disable="savingMember" v-close-popup />
          <q-btn
            color="primary"
            :label="selectionLabel"
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n({ useScope: 'global' })

const $q = useQuasar()
const route = useRoute()
const teamsStore = useTeamStore()
const userStore = useAuthStore()

const teamId = route.params.id
const loadingOne = ref(false)
const requesting = ref(false)
const savingMember = ref(false)

const team = computed(() => teamsStore.current)
const user = computed(() => userStore.user)

// status de visualização
const status = computed(() => {
  const m = team.value?.member
  const raw = team.value?.approval
  if (m === true) return 'approved'
  const appr = typeof raw === 'string' ? raw.toLowerCase().trim() : raw
  if (appr === 'pending' || appr === 'pendding') return 'pending'
  if (appr === 'rejected') return 'rejected'
  return 'not_member'
})

// opções de função (labels traduzidos, values estáveis pra API)
const roleOptions = computed(() => ([
  { label: $t('teams.roles.member'), value: 'member' },
  { label: $t('teams.roles.admin'), value: 'admin' },
  { label: $t('teams.roles.rejected'), value: 'rejected' }
]))

const memberDialog = ref({
  open: false,
  member: null,
  selection: null
})

const selectionLabel = computed(() => {
  const opt = roleOptions.value.find(o => o.value === memberDialog.value.selection)
  return opt ? opt.label : $t('common.save')
})

// ======================= FUNÇÕES =======================

/** Carrega dados de uma equipe específica */
async function loadOne () {
  try {
    loadingOne.value = true
    $q.loading.show()
    await teamsStore.fetchOne({ id: teamId })
  } catch (e) {
    $q.notify({ type: 'negative', message: teamsStore.error || $t('teams.errors.loadOne') })
  } finally {
    loadingOne.value = false
    $q.loading.hide()
  }
}

/** Envia solicitação de participação na equipe */
async function joinRequest () {
  try {
    requesting.value = true
    $q.loading.show()
    await teamsStore.createMember({ teamId, memberId: user.value.id })
    await loadOne()
    $q.notify({ type: 'positive', message: $t('teams.messages.requestSent') })
  } catch (e) {
    $q.notify({ type: 'negative', message: teamsStore.error || $t('teams.errors.request') })
  } finally {
    requesting.value = false
    $q.loading.hide()
  }
}

/** Abre o modal de gerenciamento do membro */
function openMemberModal (member) {
  if (team.value.my_role === 'admin' || team.value.my_role === 'owner') {
    memberDialog.value.member = member
    memberDialog.value.selection = (member?.status === 'rejected')
      ? 'rejected'
      : (member?.role ?? 'member')
    memberDialog.value.open = true
  } else {
    $q.notify({ type: 'negative', message: $t('teams.errors.cannotModifyMember') })
  }
}

/** Salva alterações do membro */
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
    $q.notify({ type: 'positive', message: $t('teams.messages.saved') })
  } catch (e) {
    $q.notify({ type: 'negative', message: teamsStore.error || $t('teams.errors.save') })
  } finally {
    savingMember.value = false
    $q.loading.hide()
  }
}

onMounted(loadOne)
</script>
