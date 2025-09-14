<template>
  <q-page class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input
        v-model="name"
        type="text"
        :label="t('auth.fullName')"
        outlined
        :rules="[val => !!val || t('auth.errors.nameRequired')]"
      />

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
        :rules="[val => val && val.length >= 6 || t('auth.errors.passwordMinLength')]"
      />

      <q-input
        v-model="confirmPassword"
        type="password"
        :label="t('auth.confirmPassword')"
        outlined
        :rules="[val => val === password || t('auth.errors.passwordMismatch')]"
      />

      <div class="row items-center justify-between">
        <q-btn
          :label="t('auth.createAccount')"
          color="primary"
          type="submit"
        />
        <router-link :to="{ name: 'login' }" class="text-primary">
          {{ t('auth.alreadyHaveAccount') }}
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

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

async function onSubmit () {
  if (password.value !== confirmPassword.value) return
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value
    })
    router.push({ name: 'dashboard' })
  } catch (e) {}
}
</script>
