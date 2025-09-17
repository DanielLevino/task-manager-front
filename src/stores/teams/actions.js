import { api } from 'boot/axios'

export default {

  async fetchTeams() {
    this.loading = true
    this.error = null
    try {
      const { data } = await api.get('api/teams')
      this.items = Array.isArray(data) ? data : []
    } catch (e) {
      this.error = e?.response?.data?.message || e.message || 'Erro ao carregar equipes'
      throw e
    } finally {
      this.loading = false
    }
  },

  async fetchOne({ id }) {
    this.loading = true
    this.error = null
    try {
      const { data } = await api.get(`api/teams/${id}`)
      this.current = data;
      console.log()
    } catch (e) {
      this.error = e?.response?.data?.message || e.message || 'Erro ao carregar equipes'
      throw e
    } finally {
      this.loading = false
    }
  },

  async create({ name }) {
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

  async createMember({teamId, memberId}) {
    try {
      await api.post('api/team-memberships', {teamId, memberId})
      this.current.member = true;
    } catch (error) {
      console.log(error);
    }
  },

  async updateMembershipRole(payload) {
    const { teamId, membershipId, role, teamMembershipId } = payload
    try {
      await api.patch(`api/team-memberships/${teamMembershipId}`, payload)
    } catch (error) {
      console.log(error);
    }
  }

}
