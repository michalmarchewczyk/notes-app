<template>
  <div class="absolute h-full w-full">
    <div class="t-0 l-0 w-full h-full p-4 flex pb-0 md:gap-4 max-w-screen-xl mx-auto">
      <div class="w-0 md:w-96 overflow-x-hidden flex-grow">
        <div ref="notesList" class="notes-list relative h-full  p-2 pt-0" @scroll="scroll">
          <button
            class="text-white text-center border-2 border-white p-4 py-2 w-full outline-none focus:outline-none font-bold sticky top-0 bg-black z-10"
            @click="noteAdd"
          >
            Add Note
          </button>
          <transition-group name="list" tag="div">
            <Note v-for="note in notes" :key="note.id" :note="note" @del="noteDel" />
          </transition-group>
        </div>
      </div>

      <NuxtChild class="h-full w-full text-white px-2 " />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Note from '@/components/Note'

export default {
  name: 'Notes',
  components: { Note },
  middleware: ['route-guard-logged-in'],
  computed: {
    ...mapState('notes', ['notes', 'moreAvailable', 'loading'])
  },
  async beforeMount () {
    await this.loadNotes()

    const notesList = this.$refs.notesList
    let loaded = (notesList.scrollHeight > notesList.clientHeight + 800)

    while (!loaded) {
      await this.loadMoreNotes()
      if (notesList.scrollHeight > notesList.clientHeight + 800) {
        loaded = true
      }
      if (!this.moreAvailable) {
        loaded = true
      }
    }
  },
  methods: {
    ...mapActions('notes', ['addNote', 'loadNotes', 'loadMoreNotes']),
    scroll () {
      const notesList = this.$refs.notesList
      if (!this.loading && notesList.scrollTop >= (notesList.scrollHeight - notesList.offsetHeight - 400)) {
        this.loadMoreNotes()
      }
    },
    noteAdd () {
      this.addNote({ name: 'New note', value: '' })
    },
    noteDel () {
      this.loadMore()
    },
    async loadMore () {
      const notesList = this.$refs.notesList
      let loaded = (notesList.scrollHeight > notesList.clientHeight + 800)

      while (!loaded) {
        await this.loadMoreNotes()
        if (notesList.scrollHeight > notesList.clientHeight + 800) {
          loaded = true
        }
        if (!this.moreAvailable) {
          loaded = true
        }
      }
    }
  },
  head: () => ({
    title: 'Notes - Marchewczyk.notes'
  })
}
</script>

<style lang='scss' scoped>

.notes-list {
  overflow-x: hidden;
  overflow-y: scroll;

  button {
    box-shadow: 0 6px 0 black;
  }
}

.list-item {
  transition: all 0.2s ease, opacity 0.2s cubic-bezier(0.5, 0, 0.75, 0);
}

.list-enter {
  //opacity: 0;
  transform: translateY(-9rem);
}

.list-leave-to {
  opacity: 0;
  height: 0;
  margin-top: -0.5rem;
  margin-bottom: -0.5rem;
  padding-top: 0;
  padding-bottom: 0;
}

.list-leave-active {
  transition: all 0.2s ease, opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}

</style>
