export default function (context) {
  if (context.store.state.user.logged) {
    context.redirect('/')
  }
}
