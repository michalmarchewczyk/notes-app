export const actions = {
  nuxtServerInit ({ commit }, { res }) {
    if (res?.locals?.user) {
      const { allClaims: claims, idToken: token, ...authUser } = res.locals.user
      commit('user/ON_AUTH_STATE_CHANGED_MUTATION', { authUser, claims, token })
    }
  }
}
