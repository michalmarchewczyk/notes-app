<template>
  <NuxtLink
    :to="`/notes/${note.id}`"
    class="block h-24 my-4 p-3 border-2 border-white list-item relative overflow-hidden bg-black"
  >
    <div>
      <div
        :class="{italic: !note.saved}"
        class="text-2xl font-bold text-white mb-2 whitespace-nowrap overflow-ellipsis w-full overflow-hidden"
      >
        {{ note.name }}
      </div>
      <p class="text-white text-xl opacity-75">
        {{ note.created ? date : localDate }}
      </p>
    </div>
  </NuxtLink>
</template>
<script>
import { mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'Note',
  emits: ['del'],
  props: {
    note: { type: Object, default: null }
  },
  computed: {
    date () {
      return moment(this.note.created.toDate()).format('YYYY-MM-DD HH:mm')
    },
    localDate () {
      return moment().format('YYYY-MM-DD HH:mm')
    }
  },
  methods: {
    ...mapActions('notes', ['deleteNote']),
    async del () {
      await this.deleteNote({ id: this.note.id })
      this.$emit('del')
    }
  }
}
</script>
