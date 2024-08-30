import axios from 'axios'
const baseUrl = '/api/users'

// sign in the app by sending info
const register = async (info) => {
  const resp = await axios.post(baseUrl, info)
  return resp.data
}

export default { register }