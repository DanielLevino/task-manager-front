import { api } from 'boot/axios'

export default {
  async csrf () {
    await api.get('/sanctum/csrf-cookie')
  },

  async fetchMe () {
    try {
      const { data } = await api.get('/api/auth/me')
      this.user = data
      this.error = null
    } catch (e) {
      this.user = null
    }
  },

  async login ({ email, password }) {
    this.loading = true
    this.error = null
    try {
      await this.csrf()
      await api.post('/login', { email, password })
      await this.fetchMe()
    } catch (e) {
      this.error = e?.response?.data?.message || 'Falha no login'
      throw e
    } finally {
      this.loading = false
    }
  },

  async register ({ name, email, password }) {
    this.loading = true
    this.error = null
    try {
      await this.csrf()
      await api.post('/register', { name, email, password })
      await this.fetchMe()
    } catch (e) {
      this.error = e?.response?.data?.message || 'Falha no registro'
      throw e
    } finally {
      this.loading = false
    }
  },

  async logout () {
    try {
      await this.csrf()
      await api.post('/logout')
    } finally {
      this.user = null
    }
  }
}
