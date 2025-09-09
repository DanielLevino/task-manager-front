<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated>
      <q-toolbar>

        <q-btn
          flat dense round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Task Manager
        </q-toolbar-title>

        <div class="row items-center q-gutter-sm">
          <q-avatar v-if="auth.user" color="primary" text-color="white" size="32px">
            {{ initials }}
          </q-avatar>

          <q-btn
            v-if="auth.user"
            dense flat round icon="expand_more"
          >
            <q-menu anchor="bottom right" self="top right">
              <q-list style="min-width: 180px">
                <q-item v-close-popup>
                  <q-item-section>
                    <div class="text-subtitle2">{{ auth.user?.name }}</div>
                    <div class="text-caption text-grey-7">{{ auth.user?.email }}</div>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-ripple @click="goProfile" v-close-popup>
                  <q-item-section avatar><q-icon name="person" /></q-item-section>
                  <q-item-section>Perfil</q-item-section>
                </q-item>
                <q-item clickable v-ripple @click="doLogout" v-close-popup>
                  <q-item-section avatar><q-icon name="logout" /></q-item-section>
                  <q-item-section>Sair</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>

      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list padding>
        <q-item clickable v-ripple :active="isActive('dashboard')" @click="to('dashboard')">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple :active="isActive('team')" @click="to('team')">
          <q-item-section avatar><q-icon name="diversity_2" /></q-item-section>
          <q-item-section>Equipes</q-item-section>
        </q-item>

        <q-item clickable v-ripple :active="isActive('tasks.create')" @click="to('tasks.create')">
          <q-item-section avatar><q-icon name="add_task" /></q-item-section>
          <q-item-section>Nova Tarefa</q-item-section>
        </q-item>

        <!-- Adicione outros itens de navegação aqui -->
      </q-list>
    </q-drawer>

    <!-- CONTEÚDO -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const leftDrawerOpen = ref(false)

const initials = computed(() => {
  const n = auth.user?.name || ''
  const parts = n.trim().split(' ').filter(Boolean)
  if (!parts.length) return 'U'
  const a = parts[0][0] || ''
  const b = parts[parts.length - 1][0] || ''
  return (a + (b || '')).toUpperCase()
})

function to (name) {
  router.push({ name })
}

function isActive (name) {
  return route.name === name
}

async function doLogout () {
  try {
    await auth.logout()
    router.push({ name: 'login' })
  } catch (e) {
    // opcional: tratar erro
  }
}

function goProfile () {
  // futura página de perfil
  // router.push({ name: 'profile' })
}

onMounted(async () => {
  if (!auth.user) {
    await auth.fetchMe()
    if (!auth.isAuthenticated) {
      router.push({ name: 'login' })
    }
  }
})
</script>
