import axios from 'axios'
const baseUrl = '/api/ads'

// get the full ad details
const adInfo = async (id) => {
  try {
    const resp = await axios.get(`${baseUrl}/${id}`)
    return resp.data
  }
  catch(exception) {
    console.log(exception)
  }
}

const deleteAd = async (id, token) => {
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

const postAd = async (data, token) => {
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

const getAdsOfNet = async (id) => {
  try {
    // console.log(`${baseUrl}/network/${id}`)
    const resp = await axios.get(`${baseUrl}/network/${id}`)
    return resp.data
  }
  catch(exception) {
    console.log(exception)
  }
}

const setInterest = async (id, data, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  try {
    const resp = await axios.put(`${baseUrl}/${id}`, data, config)
    return resp.data
  }
  catch(exception) {
    console.log(exception)
  }  
}

const getRandomAds = async (num) => {
  try {
    const resp = await axios.get(`${baseUrl}/random/${num}`)
    // console.log('fefefe', resp.data)
    return resp.data
  }
  catch(exception) {
    console.log(exception)
  }  
}

export default { adInfo, deleteAd, postAd, getAdsOfNet, setInterest, getRandomAds }