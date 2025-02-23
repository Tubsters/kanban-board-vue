import { describe, it, expect } from 'vitest'
import { useKanban } from '/Users/tobiashenriksen/Documents/kanban-board-vue/kanban-board/src/composables/useKanban.ts'

describe('useKanban', () => {
  it('tilføjer et nyt kort', () => {
    const { cards, addCard } = useKanban()
    const initialLength = cards.value.length
    addCard({ title: 'Testkort', description: 'Test beskrivelse', columnId: 1 })
    expect(cards.value.length).toBe(initialLength + 1)
    expect(cards.value[cards.value.length - 1].title).toBe('Testkort')
  })

  it('redigerer et kort', () => {
    const { cards, addCard, editCard } = useKanban()
    addCard({ title: 'Original', description: 'Original beskrivelse', columnId: 1 })
    const newCard = cards.value[cards.value.length - 1]
    const editedCard = { ...newCard, title: 'Redigeret' }
    editCard(editedCard)
    expect(cards.value[cards.value.length - 1].title).toBe('Redigeret')
  })

  it('sletter et kort', () => {
    const { cards, addCard, deleteCard } = useKanban()
    addCard({ title: 'Sletteligt kort', description: 'Beskrivelse', columnId: 1 })
    const cardToDelete = cards.value[cards.value.length - 1]
    deleteCard(cardToDelete)
    expect(cards.value.find(c => c.id === cardToDelete.id)).toBeUndefined()
  })

  it('flytter et kort', () => {
    const { cards, addCard, moveCard } = useKanban()
    addCard({ title: 'Flyt mig', description: 'Beskrivelse', columnId: 1 })
    const cardToMove = cards.value[cards.value.length - 1]
    moveCard({ cards: [cardToMove], columnId: 2 })
    expect(cards.value.find(c => c.id === cardToMove.id)?.columnId).toBe(2)
  })
})
