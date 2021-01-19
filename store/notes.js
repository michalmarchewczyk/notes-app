import firebase from 'firebase/app'
import Vue from 'vue'

export const state = () => ({
  notesUID: null,
  notes: [],
  moreAvailable: false,
  loading: true,
  adding: 0
})

export const getters = {
  notes: state => state.notes,
  lastNote: state => state.notes[state.notes.length - 1],
  note: state => id => state.notes.find(note => note.id === id)
}

export const actions = {
  async loadNotes ({ commit, rootState, state }) {
    if (!rootState.user.logged) {
      commit('setNotesUID', null)
      commit('setNotes', [])
      return []
    }
    if (state.notesUID === rootState.user.user?.uid) {
      return []
    }
    commit('setNotes', [])
    commit('setLoading', true)
    commit('setNotesUID', rootState.user.user?.uid ?? '')
    const notes = await this.$fire.firestore.collection('notes')
      .where('uid', '==', rootState.user.user?.uid ?? '')
      .orderBy('created', 'desc')
      .limit(10)
      .get()
      .then(res => res.docs.map(doc => ({ ...doc.data(), id: doc.id, saved: true })))
      .catch((e) => {
        console.log('Error', e)
      })
    commit('setMoreAvailable', notes.length >= 10)
    commit('setNotes', notes)
    commit('setLoading', false)
  },
  async loadMoreNotes ({ commit, rootState, getters, state }) {
    if (!rootState.user.logged) {
      return []
    }
    if (!getters.lastNote) {
      return []
    }
    if (!state.moreAvailable) {
      return []
    }
    commit('setLoading', true)
    const notes = await this.$fire.firestore.collection('notes')
      .where('uid', '==', rootState.user.user?.uid ?? '')
      .orderBy('created', 'desc')
      .limit(10)
      .startAfter(getters.lastNote.created)
      .get()
      .then(res => res.docs.map(doc => ({ ...doc.data(), id: doc.id, saved: true })))
      .catch((e) => {
        console.log('Error', e)
      })
    commit('setMoreAvailable', notes.length >= 10)
    commit('appendNotes', notes)
    commit('setLoading', false)
  },
  async addNote ({ commit, rootState }, payload) {
    const { name, value } = payload
    try {
      if (!rootState.user.logged) {
        return
      }
      commit('setAdding', 1)
      const newNote = { name, value, uid: rootState.user.user?.uid }
      const note = await this.$fire.firestore.collection('notes').add({
        ...newNote,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
      commit('prependNotes', [{ ...newNote, id: note.id }])
      const createdNote = await this.$fire.firestore.collection('notes').doc(note.id).get().then(res => res.data())
      commit('refreshNote', { id: note.id, data: { created: createdNote.created, saved: true } })
      commit('setAdding', -1)
      await this.$router.push(`/notes/${note.id}`)
    } catch (e) {
      console.log('Error', e)
    }
  },
  updateNote ({ commit, rootState }, payload) {
    const { id, name, value } = payload
    if (!rootState.user.logged) {
      return
    }
    try {
      if (!id) {
        return
      }
      const data = {}
      if (name) {
        data.name = name
      }
      if (value) {
        data.value = value
      }
      data.saved = false
      commit('refreshNote', { id, data })
    } catch (e) {
      console.log('Error', e)
    }
  },
  async saveNote ({ commit, getters, rootState }, payload) {
    const { id } = payload
    if (!rootState.user.logged) {
      return
    }
    try {
      if (!id) {
        return
      }
      const note = getters.note(id)
      await this.$fire.firestore.collection('notes').doc(id).update({ name: note.name, value: note.value })
      commit('refreshNote', { id, data: { saved: true } })
    } catch (e) {
      console.log('Error', e)
    }
  },
  async deleteNote ({ commit, rootState }, payload) {
    const { id } = payload
    if (!rootState.user.logged) {
      return
    }
    try {
      await this.$fire.firestore.collection('notes').doc(id).delete()
      commit('deleteNote', { id })
      await this.$router.push('/notes/')
    } catch (e) {
      console.log('Error', e)
    }
  }
}

export const mutations = {
  setLoading: (state, payload) => {
    state.loading = payload
  },
  setNotesUID: (state, payload) => {
    state.notesUID = payload
  },
  setNotes: (state, payload) => {
    state.notes = payload
  },
  appendNotes: (state, payload) => {
    state.notes = [...state.notes, ...payload]
  },
  prependNotes: (state, payload) => {
    state.notes = [...payload, ...state.notes]
  },
  setMoreAvailable: (state, payload) => {
    state.moreAvailable = payload
  },
  setAdding: (state, payload) => {
    state.adding += payload
  },
  refreshNote: (state, payload) => {
    Object.entries(payload.data).forEach(([key, value]) => {
      Vue.set(state.notes.find(note => note.id === payload.id), key, value)
    })
  },
  deleteNote: (state, payload) => {
    state.notes = state.notes.filter(note => note.id !== payload.id)
  }
}
