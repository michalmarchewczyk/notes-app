export const state = () => ({
  logged: false,
  user: null,
  loading: false,
  error: null
})

export const actions = {
  async signIn ({ commit }, payload) {
    commit('setLoading', true)
    await this.$fire.auth.signInWithEmailAndPassword(payload.email, payload.password)
      .then(() => {
        commit('setError', '')
        commit('setLoading', false)
        return this.$router.push('/')
      })
      .catch((error) => {
        commit('setError', error.message)
        commit('setLoading', false)
      })
  },
  async signOut ({ commit }) {
    commit('setLoading', true)
    await this.$fire.auth.signOut()
      .then(() => {
        commit('setError', '')
        commit('setLoading', false)
      })
      .catch((e) => {
        console.log('Error', e)
      })
  },
  async signUp ({ commit }, payload) {
    commit('setLoading', true)
    await this.$fire.auth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then((res) => {
        return res.user.updateProfile({ displayName: payload.name })
      })
      .then(() => {
        commit('setError', '')
        commit('setLoading', false)
        commit('setDisplayName', payload.name)
        return this.$router.push('/')
      })
      .catch((error) => {
        commit('setError', error.message)
        commit('setLoading', false)
      })
  },
  onAuthStateChangedAction ({ commit, dispatch }, { authUser }) {
    if (!authUser) {
      dispatch('notes/loadNotes', {}, { root: true })
    }
  }
}

export const mutations = {
  setUser: (state, payload) => {
    state.user = payload
  },
  setError: (state, payload) => {
    state.error = payload
  },
  setLogged: (state, payload) => {
    state.logged = payload
  },
  setLoading: (state, payload) => {
    state.loading = payload
  },
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser }) => {
    if (!authUser) {
      state.user = null
      state.logged = false
    } else {
      const { email, uid } = authUser
      state.user = { email, uid }
      if (authUser.displayName) {
        state.user = { ...state.user, displayName: authUser.displayName }
      }
      if (authUser.photoURL) {
        state.user = { ...state.user, photoURL: authUser.photoURL }
      }
      state.logged = true
    }
    state.loading = false
  },
  setDisplayName: (state, payload) => {
    state.user = { ...state.user, displayName: payload }
  }

}
