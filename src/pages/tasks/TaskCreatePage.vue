<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <q-btn flat icon="arrow_back" label="Voltar" @click="$router.back()" />
      <q-space />
      <div class="text-h6">Nova Tarefa</div>
    </div>

    <TaskCreate/>
    
  </q-page>
</template>

<script setup>
import TaskCreate from 'src/components/tasks/TaskCreate.vue';

</script>
