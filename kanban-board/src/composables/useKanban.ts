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
    { id: 1, title: 'Test Kort', description: 'Dette er et test kort', columnId: 2 }
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

  const moveCard = ({ cards: movedCards, columnId }: { cards: Card[]; columnId: number }) => {
    movedCards.forEach(movedCard => {
      const index = cards.value.findIndex(c => c.id === movedCard.id)
      if (index !== -1) {
        cards.value[index].columnId = columnId
      }
    })
  }

  return { columns, cards, addCard, editCard, deleteCard, moveCard }
}