<template>
	<q-page class="q-pa-md">
		<div class="row items-center q-mb-md">
      <q-btn flat icon="arrow_back" label="Voltar" @click="$router.back()" />
      <q-space />
      <q-btn color="primary" @click="showDialog = true" >Nova Equipe</q-btn>
    </div>

    <q-card>
      <q-card-section>
        <div class="text-h6">
          card list equipes
        </div>
      </q-card-section>
    </q-card>

    <!-- modal create -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">Nova Equipe</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="createTeam">
            <q-input
              v-model="form.name"
              label="Nome da Equipe"
              outlined
              dense
              autofocus
              :rules="[val => !!val || 'O nome é obrigatório']"
            />
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn 
            label="Criar" 
            color="primary" 
            @click="createTeam" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
	</q-page>
</template>
<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useTeamStore } from 'src/stores/teams'

const $q = useQuasar()
const team = useTeamStore()

// Estado do modal
const showDialog = ref(false)

// Formulário
const form = ref({
  name: ''
})

// Função para criar equipe
async function createTeam() {
  if (!form.value.name) {
    $q.notify({ type: 'negative', message: 'Informe o nome da equipe' })
    return
  }
  try {
    await team.create({name: form.value.name})
    $q.notify({ type: 'positive', message: `Equipe "${form.value.name}" criada!` })
  } catch (error) {
    $q.notify({ type: 'negative', message: error })
  }

  
  showDialog.value = false
  form.value.name = ''
}
</script>