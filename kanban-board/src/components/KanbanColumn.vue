<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { PropType } from 'vue'
import draggable from 'vuedraggable'
import CardItem from './CardItem.vue'
import EditCardModal from './EditCardModal.vue'

// Definér dine data-typer
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

    // Lokal liste af kort i denne kolonne
    const localCards = ref<Card[]>([...props.cards])

    // Hold localCards i sync med props.cards
    watch(
      () => props.cards,
      (newCards) => {
        localCards.value = [...newCards]
      }
    )

    // Åbn dialog for at tilføje et nyt kort
    const openAddCardDialog = () => {
      selectedCard.value = null
      showModal.value = true
    }

    // Gem kort (oprettelse eller redigering)
    const handleSave = (cardData: Card) => {
      if (cardData.id) {
        // Kortet findes allerede, så vi emitter en edit-event
        emit('edit-card', cardData)
      } else {
        // Kortet er nyt
        cardData.columnId = props.column.id
        emit('add-card', cardData)
      }
      showModal.value = false
    }

    // Forbered redigering af kort
    const handleEdit = (card: Card) => () => {
      selectedCard.value = card
      showModal.value = true
    }

    // Forbered sletning af kort
    const handleDelete = (card: Card) => () => {
      emit('delete-card', card)
    }

    // Luk modal
    const closeModal = () => {
      showModal.value = false
    }

    // Drag & drop afsluttes
    const onDragEnd = () => {
      // Opdater columnId for alle kort, der nu ligger i localCards
      localCards.value.forEach((card) => {
        card.columnId = props.column.id
      })
      // Fortæl forældre (KanbanBoard) at kort er flyttet
      emit('move-card', {
        cards: localCards.value,
        columnId: props.column.id
      })
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
        <!-- Drag & drop med vuedraggable -->
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

    <!-- Modal til oprettelse/redigering af kort -->
    <EditCardModal
      v-if="showModal"
      :card="selectedCard"
      :columnId="column.id"
      @save="handleSave"
      @close="closeModal"
    />
  </v-col>
</template>
