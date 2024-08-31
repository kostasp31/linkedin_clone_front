import axios from 'axios'
const baseUrl = '/api/data'

// get the data of a specific user
const userData = async (id) => {
  try {
    const resp = await axios.get(`${baseUrl}/${id}`)
    return resp.data
  }
  catch(exception) {
    console.log(exception)
  }
}

const  updateData = async (id, newData, token) => {
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

export default { userData, updateData }