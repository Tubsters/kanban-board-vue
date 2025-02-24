<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { PropType } from 'vue'
import draggable from 'vuedraggable'
import CardItem from './CardItem.vue'
import EditCardModal from './EditCardModal.vue'

interface Card {
  id: number
  title: string
  description: string
  columnId: number
}

interface Column {
  id: number
  title: string
}

export default defineComponent({
  name: 'KanbanColumn',
  components: {
    draggable,
    CardItem,
    EditCardModal
  },
  props: {
    column: {
      type: Object as PropType<Column>,
      required: true
    },
    cards: {
      type: Array as PropType<Card[]>,
      required: true
    }
  },
  emits: ['add-card', 'edit-card', 'delete-card', 'move-card'],
  setup(props, { emit }) {
    const showModal = ref(false)
    const selectedCard = ref<Card | null>(null)
    const localCards = ref<Card[]>([...props.cards])
    const isOver = ref(false)

    watch(() => props.cards, (newCards) => {
      localCards.value = [...newCards]
    })

    const openAddCardDialog = () => {
      selectedCard.value = null
      showModal.value = true
    }

    const handleSave = (cardData: Card) => {
      if (cardData.id) {
        emit('edit-card', cardData)
      } else {
        cardData.columnId = props.column.id
        emit('add-card', cardData)
      }
      showModal.value = false
    }

    const handleEdit = (card: Card) => {
      selectedCard.value = card
      showModal.value = true
    }

    const handleDelete = (card: Card) => {
      emit('delete-card', card)
    }

    const closeModal = () => {
      showModal.value = false
    }

    const onDragEnd = (event: any) => {
      const { oldIndex, newIndex } = event
      if (oldIndex === newIndex) return 
      const movedCard = localCards.value[newIndex]
      if (movedCard) {
        emit('move-card', { card: movedCard, newColumnId: props.column.id })
      }
    }

    const onDragEnter = () => { isOver.value = true }
    const onDragOver = (event: DragEvent) => { 
      event.preventDefault()
      isOver.value = true 
    }
    const onDragLeave = () => { isOver.value = false }
    const onDrop = (event: DragEvent) => { 
      event.preventDefault()
      isOver.value = false 
    }

    return {
      showModal,
      selectedCard,
      localCards,
      isOver,
      openAddCardDialog,
      handleSave,
      handleEdit,
      handleDelete,
      closeModal,
      onDragEnd,
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop
    }
  }
})
</script>

<template>
  <v-col cols="4"
         class="drop-zone"
         @dragenter="onDragEnter"
         @dragover="onDragOver"
         @dragleave="onDragLeave"
         @drop="onDrop"
         :class="{ 'drop-active': isOver }">
    <v-card class="mb-4">
      <v-card-title>{{ column.title }}</v-card-title>
      <v-card-text>
        <draggable
          v-model="localCards"
          :group="{ name: 'kanban' }"
          :animation="200"
          :fallbackTolerance="20"
          @end="onDragEnd"
        >
          <template #item="{ element }">
            <CardItem
              :card="element"
              @edit-card="handleEdit(element)"
              @delete-card="handleDelete(element)"
            />
          </template>
        </draggable>
      </v-card-text>
      <v-card-actions>
        <v-btn small @click="openAddCardDialog">Tilføj kort</v-btn>
      </v-card-actions>
    </v-card>
    <EditCardModal
      v-if="showModal"
      :card="selectedCard"
      :columnId="column.id"
      @save="handleSave"
      @close="closeModal"
    />
  </v-col>
</template>

<style scoped>
.drop-zone {
  /*drop area */
  min-height: 300px;
  padding: 1.5rem;
  transition: background-color 0.2s ease, border 0.2s ease;
}

.drop-active {
  border: 2px dashed #1976d2;
  background-color: rgba(25, 118, 210, 0.1);
}
</style>
