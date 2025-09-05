<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Conteúdo centralizado -->
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
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup></script>

<style scoped></style>
