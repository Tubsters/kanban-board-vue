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

    watch(
      () => props.cards,
      (newCards) => {
        localCards.value = [...newCards]
      }
    )

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

    return {
      showModal,
      selectedCard,
      localCards,
      openAddCardDialog,
      handleSave,
      handleEdit,
      handleDelete,
      closeModal,
      onDragEnd
    }
  }
})
</script>

<template>
  <v-col cols="4">
    <v-card class="mb-4">
      <v-card-title>{{ column.title }}</v-card-title>
      <v-card-text>
        <draggable
          v-model="localCards"
          :group="{ name: 'kanban' }"
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