<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

// Samme Card-interface (eller hent det fra en fælles fil, hvis du foretrækker)
interface Card {
  id: number
  title: string
  description: string
  columnId: number
}

export default defineComponent({
  name: 'CardItem',
  props: {
    card: {
      type: Object as PropType<Card>,
      required: true
    }
  },
  emits: ['edit-card', 'delete-card']
})
</script>

<template>
  <v-card class="mb-2">
    <v-card-title>{{ card.title }}</v-card-title>
    <v-card-text>{{ card.description }}</v-card-text>
    <v-card-actions>
      <v-btn icon @click="$emit('edit-card')">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('delete-card')">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
