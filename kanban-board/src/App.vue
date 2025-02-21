<script lang="ts">
import { defineComponent } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue'

export default defineComponent({
  name: 'App',
  components: { KanbanBoard }
})
</script>

<template>
  <v-app>
    <KanbanBoard />
  </v-app>
</template>
