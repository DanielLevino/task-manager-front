import { api } from 'boot/axios'

export default {

  async create ({ name }) {
    console.log("create Teams", name);
    
    this.loading = true
    this.error = null
    try {
      await api.post('api/teams', { name })
    } catch (e) {
      this.error = e?.response?.data?.message || 'Falha no registro'
      throw e
    } finally {
      this.loading = false
    }
  },
}
