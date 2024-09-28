import axios from 'axios'
const baseUrl = '/api/users'

const getAllUserData = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  try {
    const resp = await axios.get(`${baseUrl}`, config)
    return resp.data
  }
  catch(exception) {
    console.log(exception)
  }  
}

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

const submitProfile = async (file, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const formData = new FormData()
  formData.append("selectedFile", file)

  try {
    const resp = await axios.post('/api/upload/profiles', formData, config)
    return resp.data
  } catch(error) {
    console.log(error)
  }
}

const submitMedia = async (file, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const formData = new FormData()
  formData.append("selectedFile", file)

  try {
    const resp = await axios.post('/api/upload/blog_media', formData, config)
    return resp.data
  } catch(error) {
    console.log(error)
  }
}

export default { getAllUserData, userInfo, updateUserInfo, submitProfile, submitMedia }