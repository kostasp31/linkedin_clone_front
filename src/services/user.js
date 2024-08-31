import axios from 'axios'
const baseUrl = '/api/users'

// get the info of a specific user
const userInfo = async (id) => {
  try {
    const resp = await axios.get(`${baseUrl}/${id}`)
    return resp.data
  }
  catch(exception) {
    console.log(exception)
  }
}

const updateUserInfo = async (id, newData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  try {
    const resp = await axios.put(`${baseUrl}/${id}`, newData, config)
    return resp.data
  }
  catch(exception) {
    console.log(exception)
  }
}

export default { userInfo, updateUserInfo }