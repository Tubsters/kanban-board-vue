<script lang="ts">
import { defineComponent } from 'vue'
import KanbanColumn from './KanbanColumn.vue'
import { useKanban } from '../composables/useKanban'

export default defineComponent({
  name: 'KanbanBoard',
  components: { KanbanColumn },
  setup() {
    const { columns, cards, addCard, editCard, deleteCard, moveCard } = useKanban()

    const cardsByColumn = (columnId: number) =>
      cards.value.filter(card => card.columnId === columnId)

    return {
      columns,
      cards,
      addCard,
      editCard,
      deleteCard,
      moveCard,
      cardsByColumn
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
        @move-card="moveCard"
      />
    </v-row>
  </v-container>
</template>
