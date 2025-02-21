  <script lang="ts">
  import { defineComponent, ref, watch, computed } from 'vue'
  
  export default defineComponent({
    name: 'EditCardModal',
    props: {
      card: { 
        type: Object, 
        default: () => ({ title: '', description: '' }) 
      },
      columnId: { type: Number, required: true }
    },
    emits: ['save', 'close'],
    setup(props, { emit }) {
      const dialog = ref(true)
      const localCard = ref({ ...props.card })
  
      watch(() => props.card, newVal => {
        localCard.value = { ...newVal }
      })
  
      const isEdit = computed(() => !!localCard.value.id)
  
      const close = () => {
        dialog.value = false
        emit('close')
      }
  
      const save = () => {
        emit('save', { ...localCard.value, columnId: props.columnId })
      }
  
      return { dialog, localCard, isEdit, close, save }
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
          <v-text-field v-model="localCard.title" label="Titel"></v-text-field>
          <v-textarea v-model="localCard.description" label="Beskrivelse"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Annuller</v-btn>
          <v-btn color="blue darken-1" text @click="save">Gem</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  