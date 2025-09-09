<template>
  <q-page class="q-pa-md">

    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input
        v-model="name"
        type="text"
        label="Nome completo"
        outlined
        :rules="[val => !!val || 'Informe seu nome']"
      />

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
        :rules="[val => val && val.length >= 6 || 'Mínimo 6 caracteres']"
      />

      <q-input
        v-model="confirmPassword"
        type="password"
        label="Confirmar senha"
        outlined
        :rules="[val => val === password || 'Senhas não conferem']"
      />

      <div class="row items-center justify-between">
        <q-btn
          label="Criar conta"
          color="primary"
          type="submit"
        />
        <router-link :to="{ name: 'login' }" class="text-primary">
          Já tenho conta
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

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

async function onSubmit () {
  if (password.value !== confirmPassword.value) return
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value })
    router.push({ name: 'dashboard' })
  } catch (e) {}
}
</script>

