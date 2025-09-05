export default {
  isAuthenticated: (state) => !!state.user,
  userName: (state) => state.user?.name || ''
}
