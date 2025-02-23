<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import type { PropType } from 'vue'

interface Card {
  id: number
  title: string
  description: string
  columnId: number
}

export default defineComponent({
  name: 'EditCardModal',
  props: {
    card: {
      type: Object as PropType<Card | null>,
      default: null
    },
    columnId: {
      type: Number,
      required: true
    }
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {

    const localCard = ref<Card>({
      id: props.card?.id || 0,
      title: props.card?.title || '',
      description: props.card?.description || '',
      columnId: props.columnId
    })

    
    watch(
      () => props.card,
      (newCard) => {
        localCard.value = {
          id: newCard?.id || 0,
          title: newCard?.title || '',
          description: newCard?.description || '',
          columnId: props.columnId
        }
      },
      { immediate: true }
    )

    
    const dialog = ref(true)
    
    watch(dialog, (val) => {
      if (!val) {
        emit('close')
      }
    })

    const isEdit = computed(() => localCard.value.id !== 0)

    const save = () => {
      emit('save', localCard.value)
      dialog.value = false
    }

    return {
      localCard,
      dialog,
      isEdit,
      save,
      close: () => { dialog.value = false }
    }
  }
})
</script>

<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? 'Rediger kort' : 'Nyt kort' }}</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="localCard.title" label="Titel" />
        <v-textarea v-model="localCard.description" label="Beskrivelse" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" color="blue darken-1" @click="close">Annuller</v-btn>
        <v-btn variant="text" color="blue darken-1" @click="save">Gem</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
