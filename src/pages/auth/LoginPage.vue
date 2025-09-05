<template>
  <q-page class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input
        v-model="email"
        type="email"
        label="Email"
        outlined
        :rules="[val => !!val || 'Informe seu email']"
      />

      <q-input
        v-model="password"
        type="password"
        label="Senha"
        outlined
        :rules="[val => !!val || 'Informe sua senha']"
      />

      <div class="row items-center justify-between">
        <q-btn
          label="Entrar"
          color="primary"
          type="submit"
        />
        <router-link :to="{ name: 'register' }" class="text-primary">
          Criar conta
        </router-link>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')

async function onSubmit () {
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push({ name: 'dashboard' })
  } catch (e) {
    
  }
}
</script>

