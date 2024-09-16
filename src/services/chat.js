import axios from 'axios'
const baseUrl = '/api/chats'

// get the full chat
const getChat = async (id) => {
  try {
    const resp = await axios.get(`${baseUrl}/${id}`)
    return resp.data
  }
  catch(exception) {
    console.log(exception)
  }
}

const postChat = async (data, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  try {
    const resp = await axios.post(`${baseUrl}`, data, config)
    return resp.data
  }
  catch(exception) {
    console.log(exception)
  }
}

const  updateChat = async (id, newData, token) => {
  console.log(newData)
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

export default { getChat, postChat, updateChat }