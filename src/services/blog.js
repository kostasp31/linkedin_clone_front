import axios from 'axios'
const baseUrl = '/api/blogs'

// get the full blog
const blogInfo = async (id) => {
  try {
    const resp = await axios.get(`${baseUrl}/${id}`)
    return resp.data
  }
  catch(exception) {
    console.log(exception)
  }
}

const postBlog = async (data, token) => {
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

const deleteBlog = async (id, token) => {
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

const getBlogsOfNet = async (id) => {
  try {
    console.log(`${baseUrl}/network/${id}`)
    const resp = await axios.get(`${baseUrl}/network/${id}`)
    return resp.data
  }
  catch(exception) {
    console.log(exception)
  }
}

export default { blogInfo, postBlog, deleteBlog, getBlogsOfNet }