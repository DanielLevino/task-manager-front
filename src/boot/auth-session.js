import { defineBoot } from '#q-app/wrappers'
import { useAuthStore } from 'stores/auth'

export default defineBoot(async () => {
  const auth = useAuthStore()
  await auth.fetchMe() // tenta carregar usuário da sessão
})
