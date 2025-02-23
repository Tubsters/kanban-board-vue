<script lang="ts">
import { defineComponent } from 'vue'
import KanbanColumn from './KanbanColumn.vue'
import { useKanban } from '../composables/useKanban'
import type { Card, Column } from '../composables/useKanban'

export default defineComponent({
  name: 'KanbanBoard',
  components: { KanbanColumn },
  setup() {
    const { columns, cards, addCard, editCard, deleteCard } = useKanban()

    
    const cardsByColumn = (columnId: number) =>
      cards.value.filter((card: Card) => card.columnId === columnId)

    const handleMoveCard = ({ card, newColumnId }: { card: Card; newColumnId: number }) => {
      // Fjern kortet fra den globale liste (den gamle kolonne)
      cards.value = cards.value.filter((c: Card) => c.id !== card.id)
      // Tilføj kortet med opdateret columnId
      cards.value.push({ ...card, columnId: newColumnId })
    }

    return {
      columns,
      cardsByColumn,
      addCard,
      editCard,
      deleteCard,
      handleMoveCard
    }
  }
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <KanbanColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
        :cards="cardsByColumn(column.id)"
        @add-card="addCard"
        @edit-card="editCard"
        @delete-card="deleteCard"
        @move-card="handleMoveCard"
      />
    </v-row>
  </v-container>
</template>
