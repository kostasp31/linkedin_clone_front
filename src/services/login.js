import axios from 'axios'
const baseUrl = '/api/login'

// log in the app by sending username, password
const login = async (credentials) => {
  const resp = await axios.post(baseUrl, credentials)
  return resp.data
}

// send current password and new password
const changePassword = async (credentials, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const resp = await axios.post(`${baseUrl}/change_password`, credentials, config)
  return resp.data
}

export default { login, changePassword }