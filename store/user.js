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
  async signOut ({ commit, rootActions, dispatch }) {
    commit('setLoading', true)
    await this.$fire.auth.signOut()
      .then(() => {
        commit('setError', '')
        commit('setLoading', false)
      })
      .catch((error) => {
        console.log(error)
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
        return this.$router.push('/')
      })
      .catch((error) => {
        commit('setError', error.message)
        commit('setLoading', false)
      })
  },
  onAuthStateChangedAction ({ commit, dispatch }, { authUser }) {
    console.log('actionUser', authUser)
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
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    console.log('commitUser', authUser)

    if (!authUser) {
      state.user = null
      state.logged = false
    } else {
      const { displayName, email, uid } = authUser
      state.user = { displayName, email, uid }
      if (authUser.photoURL) {
        state.user.photoURL = authUser.photoURL
      }
      state.logged = true
    }

    state.loading = false
  }

}
