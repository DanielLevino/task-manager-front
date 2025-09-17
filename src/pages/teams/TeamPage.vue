<template>
  <q-page padding>
    <div class="row items-center q-gutter-sm">
      <div class="text-h6">{{ $t('teams.list') }}</div>
      <q-space />
      <q-btn
        :label="$t('common.refresh')"
        icon="refresh"
        :loading="loading"
        @click="refresh"
        flat
      />
      <q-btn
        :label="$t('teams.new')"
        color="primary"
        icon="group_add"
        @click="openCreateDialog"
      />
    </div>

    <q-pull-to-refresh @refresh="onPullRefresh">
      <div v-if="teams.length" class="q-mt-md">
        <div class="row q-col-gutter-md">
          <div
            class="col-12 col-sm-6 col-md-4 col-lg-3"
            v-for="team in teams"
            :key="team.id"
          >
            <q-card
              class="cursor-pointer"
              flat bordered clickable
              @click="goToTeam(team.id)"
              ripple
            >
              <q-card-section>
                <div class="text-subtitle1 ellipsis">{{ team.name }}</div>
                <div class="text-caption text-grey-7">
                  {{ $t('teams.roles.'+(team.member_role)) || $t('teams.member') }}
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn
                  color="primary"
                  dense
                  :aria-label="$t('common.open')"
                  :label="$t('common.open')"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>

      <div v-else class="q-mt-lg text-grey text-italic">
        {{ $t('teams.noneFound') }}
      </div>
    </q-pull-to-refresh>

    <q-dialog v-model="createOpen">
      <q-card class="size-md">
        <q-card-section class="text-h6">{{ $t('teams.create') }}</q-card-section>
        <q-card-section>
          <q-input
            v-model="form.name"
            :label="$t('teams.fields.name')"
            dense
            filled
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('common.cancel')" v-close-popup />
          <q-btn color="primary" :loading="creating" :label="$t('common.save')" @click="handleCreate"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useTeamStore } from 'src/stores/teams'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n({ useScope: 'global' })

const $q = useQuasar()
const teamsStore = useTeamStore()
const router = useRouter()

const loading = computed(() => teamsStore.loading)
const teams = computed(() => teamsStore.items)

async function load() {
  try {
    await teamsStore.fetchTeams()
  } catch (e) {
    $q.notify({ type: 'negative', message: teamsStore.error || $t('teams.errors.load') })
  }
}

onMounted(load)

async function refresh() {
  await load()
  $q.notify({ type: 'positive', message: $t('teams.messages.updated') })
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
    $q.notify({ type: 'warning', message: $t('teams.errors.nameRequired') })
    return
  }
  creating.value = true
  try {
    await teamsStore.create({ name: form.value.name.trim() })
    createOpen.value = false
    $q.notify({ type: 'positive', message: $t('teams.messages.created') })
  } catch (e) {
    $q.notify({ type: 'negative', message: teamsStore.error || $t('teams.errors.create') })
  } finally {
    creating.value = false
  }
}

function goToTeam(id) {
  router.push({ name: 'team.show', params: { id } })
}
</script>
<style scoped>
.size-md {
  width: 80vw;
}
</style>
