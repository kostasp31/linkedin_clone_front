import axios from 'axios'
const baseUrl = '/api/comments'

// get the full blog
const getComment = async (id) => {
  try {
    // get all comments
    const resp = await axios.get(`${baseUrl}/${id}`)
    return resp.data
  }
  catch(exception) {
    console.log(exception)
  }
}

const postComm = async (data, token) => {
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

const deleteComm = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  try {
    const resp = await axios.delete(`${baseUrl}/${id}`, config)
    return resp.data
  }
  catch(exception) {
    console.log(exception)
  }
}

export default { getComment, postComm, deleteComm }