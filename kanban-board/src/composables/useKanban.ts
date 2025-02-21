import { ref } from 'vue'

export interface Card {
  id: number
  title: string
  description: string
  columnId: number
}

export interface Column {
  id: number
  title: string
}

export function useKanban() {
  const columns = ref<Column[]>([
    { id: 1, title: 'To Do' },
    { id: 2, title: 'In Progress' },
    { id: 3, title: 'Done' }
  ])

  const cards = ref<Card[]>([
    { id: 1, title: 'Test kort', description: 'Dette er et test kort', columnId: 1 }
  ])

  let nextId = 2

  const addCard = (cardData: Partial<Card>) => {
    const newCard: Card = {
      id: nextId++,
      title: cardData.title || '',
      description: cardData.description || '',
      columnId: cardData.columnId || 1
    }
    cards.value.push(newCard)
  }

  const editCard = (cardData: Card) => {
    const index = cards.value.findIndex(c => c.id === cardData.id)
    if (index !== -1) {
      cards.value[index] = { ...cardData }
    }
  }

  const deleteCard = (card: Card) => {
    cards.value = cards.value.filter(c => c.id !== card.id)
  }

  const moveCard = ({ cards: movedCards, columnId }: { cards: Card[], columnId: number }) => {
    movedCards.forEach(card => {
      card.columnId = columnId
      const index = cards.value.findIndex(c => c.id === card.id)
      if(index !== -1) {
        cards.value[index] = card
      }
    })
  }

  return { columns, cards, addCard, editCard, deleteCard, moveCard }
}