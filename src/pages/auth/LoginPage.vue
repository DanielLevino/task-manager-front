<template>
  <q-page class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input
        v-model="email"
        type="email"
        :label="t('auth.email')"
        outlined
        :rules="[val => !!val || t('auth.errors.emailRequired')]"
      />

      <q-input
        v-model="password"
        type="password"
        :label="t('auth.password')"
        outlined
        :rules="[val => !!val || t('auth.errors.passwordRequired')]"
      />

      <div class="row items-center justify-between">
        <q-btn
          :label="t('auth.signIn')"
          color="primary"
          type="submit"
        />
        <router-link :to="{ name: 'register' }" class="text-primary">
          {{ t('auth.createAccount') }}
        </router-link>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')

async function onSubmit () {
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push({ name: 'dashboard' })
  } catch (e) {
    // opcional: exibir erro traduzido
    // this.$q.notify({ type: 'negative', message: t('auth.errors.generic') })
  }
}
</script>
