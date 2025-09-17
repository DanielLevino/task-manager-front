<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="text-h6">{{ t('tasks.new') }}</div>
    </div>

    <TaskCreate/>
    
  </q-page>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import TaskCreate from 'src/components/tasks/TaskCreate.vue';
const {t} = useI18n();
</script>
