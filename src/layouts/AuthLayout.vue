<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="row justify-center items-center bg-grey-2">
        <div class="q-pa-md" style="width: 100%; max-width: 400px">
          <!-- Logo / Título -->
          <div class="text-center q-mb-lg">
            <q-icon name="task" size="48px" color="primary" />
            <div class="text-h5 text-primary q-mt-sm">
              Task Manager
            </div>
          </div>

          <!-- Card que troca entre Login / Register -->
          <router-view />
        </div>

        <!-- Botão flutuante de idioma -->
        <q-fab
          icon="language"
          active-icon="close"
          color="primary"
          direction="up"
          class="fixed-bottom-right q-mb-lg q-mr-lg"
        >
          <q-fab-action
            color="white"
            text-color="primary"
            label="Português"
            @click="changeLocale('pt-BR')"
          />
          <q-fab-action
            color="white"
            text-color="primary"
            label="English"
            @click="changeLocale('en-US')"
          />
        </q-fab>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

function changeLocale (lang) {
  locale.value = lang
}
</script>
