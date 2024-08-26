import axios from 'axios'
const baseUrl = '/api/login'

// log in the app by sending username, password
const login = async (credentials) => {
  const resp = await axios.post(baseUrl, credentials)
  return resp.data
}

export default { login }