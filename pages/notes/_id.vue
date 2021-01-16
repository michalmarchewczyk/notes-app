<template>
  <div>
    <div v-if="getNote" class="flex h-full flex-col gap-2 pb-2">
      <div class="h-12 flex flex-row justify-between gap-4">
        <div class="border-2 border-white h-full flex-shrink w-64">
          <input
            v-model="name"
            class="bg-black text-white focus:outline-none h-full w-full text-indent-2"
          >
        </div>
        <span class="block bg-black text-white focus:outline-none h-full p-1 flex-shrink-0">
          {{ date }}
        </span>
        <NuxtLink class="border-2 border-white focus:outline-none h-full px-4 py-1 flex-shrink-0 block md:hidden" to="/notes">
          Close
        </NuxtLink>
      </div>

      <textarea
        v-model="value"
        class="bg-black text-white border-2 border-white focus:outline-none resize-none flex-grow px-3 py-2"
      />
      <div class="h-12 flex flex-row justify-between">
        <button class="border-2 border-white focus:outline-none h-full px-4" @click="noteDel">
          Delete
        </button>
        <button class="border-2 border-white text-white focus:outline-none h-full px-4" :class="{'opacity-50': saved, 'cursor-default': saved}" :disabled="saved" @click="noteSave">
          {{ saved ? 'Saved' : 'Save' }}
        </button>
      </div>
    <!--    Name: {{ name }}-->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import moment from 'moment'

export default {
  computed: {
    ...mapState('notes', ['loading']),
    ...mapGetters('notes', [
      'note'
    ]),
    getNote () {
      return this.note(this.$route.params.id)
    },
    date () {
      return moment(this.getNote?.created.toDate()).format('YYYY-MM-DD HH:mm')
    },
    saved () {
      return this.getNote?.saved
    },
    name: {
      get () {
        return this.getNote?.name
      },
      set (v) {
        this.updateNote({ id: this.getNote.id, name: v })
      }
    },
    value: {
      get () {
        return this.getNote?.value
      },
      set (v) {
        this.updateNote({ id: this.getNote.id, value: v })
      }
    }
  },
  methods: {
    ...mapActions('notes', ['updateNote', 'saveNote', 'deleteNote']),
    async noteSave () {
      console.log('noteSave')
      await this.saveNote({ id: this.getNote.id })
    },
    async noteDel () {
      console.log('noteDel')
      console.log(this.getNote.id)
      await this.deleteNote({ id: this.getNote.id })
    }
  },
  beforeUpdate () {
    if (!this.getNote?.id) {
      console.log('NOTE NOT LOADED')
      this.$router.push('/notes')
    }
  }
}
</script>

<style scoped>

</style>
