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

export default { userInfo }