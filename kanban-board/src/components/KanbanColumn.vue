    <script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import draggable from 'vuedraggable'
  import CardItem from './CardItem.vue'
  import EditCardModal from './EditCardModal.vue'
  
  export default defineComponent({
    name: 'KanbanColumn',
    components: { CardItem, EditCardModal, draggable },
    props: {
      column: { type: Object, required: true },
      cards: { type: Array, required: true }
    },
    emits: ['add-card', 'edit-card', 'delete-card', 'move-card'],
    setup(props, { emit }) {
      const showModal = ref(false)
      const selectedCard = ref<any>(null)
      const localCards = ref([...props.cards])
  
      watch(() => props.cards, newCards => {
        localCards.value = [...newCards]
      })
  
      const openAddCardDialog = () => {
        selectedCard.value = null
        showModal.value = true
      }
  
      const handleSave = (cardData: any) => {
        if (cardData.id) {
          emit('edit-card', cardData)
        } else {
          cardData.columnId = props.column.id
          emit('add-card', cardData)
        }
        showModal.value = false
      }
  
      const handleEdit = (card: any) => () => {
        selectedCard.value = card
        showModal.value = true
      }
  
      const handleDelete = (card: any) => () => {
        emit('delete-card', card)
      }
  
      const closeModal = () => {
        showModal.value = false
      }
  
      const onDragEnd = () => {
        // Når drag & drop afsluttes, opdateres alle korts kolonne
        localCards.value.forEach(card => card.columnId = props.column.id)
        emit('move-card', { cards: localCards.value, columnId: props.column.id })
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
          <draggable v-model="localCards" @end="onDragEnd">
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
  