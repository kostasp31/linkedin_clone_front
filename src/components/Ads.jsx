import { useState, useEffect } from 'react'
import dataS from '../services/data'
import adS from '../services/ad'
import {
  Link, useNavigate
} from 'react-router-dom'
import Net_Home from './components/Net_Home'

const Display_Ad = ({id, token}) => {
  const [adInfo, setAdInfo] = useState(null)

  useEffect(() => {
    const fun = async () => {
      const data = await adS.adInfo(id)
      setAdInfo(data)
    }
    fun() 
  }, [])

  const delAd = async () => {
    await adS.deleteAd(id, token)
    setAdInfo(null)
  }

  if (adInfo) {
    return (
    <div style={{width: '100%'}}>
      <h3 style={{ textAlign: 'center' }}>{adInfo.title}</h3>
      <p style={{paddingLeft:'20px'}}>{adInfo.body}</p>  

      <div style={{paddingLeft:'20px'}}>
        <h3>Interest:</h3>
        <button className='cancelbtn' style={{float:'right', marginRight:'20px', marginLeft:'auto'}} onClick={delAd}>Delete</button>
        {
          adInfo.interested.length ?
            adInfo.interested.map((prsn) =>
            <div>
              <Net_Home pr={prsn} key={prsn} />
            </div>)
          :
            <div>
              No interest yet
            </div>
        }
      </div>
      <br />
    </div>
    )
  }
}

const Display_Ad_Net = ({usrid, ad, token, useid}) => {
  const [disableButton, setDisableButton] = useState(false)

  let id
  if (ad.id)
    id = ad.id.toString()
  else if (ad._id)
    id = ad._id.toString()

  const addInterest = async () => {
    await adS.setInterest(id.toString(), 
    {
      "interested": usrid.toString()
    }, token)
    setDisableButton(true)
  }

  if (ad.interested.includes(usrid) && !disableButton)
    setDisableButton(true)

  return (
  <div className='forms' style={{width: '100%'}}>
    <h3>{ad.title}</h3>
    <p>{ad.body}</p>  
    <button disabled={disableButton} className='savebtn' onClick={addInterest}>Im Interested</button>
  </div>
  )
}

const Ads = ({ user, setUser }) => {
  const [usrData, setUsrData] = useState(null)
  const [netAds, setNetAds] = useState(null)
  const [randAds, setRandAds] = useState(null)
  const [adTitle, setAdTitle] = useState('')
  const [adBody, setAdBody] = useState('')
  const [submit, setSubmit] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const navigate = useNavigate()
  useEffect(() => {
    const fun = async () => {
      const data = await dataS.userData(user.data.toString())
      setUsrData(data)

      const netads = await adS.getAdsOfNet(data.id.toString())
      setNetAds(netads)

      const rands = await adS.getRandomAds("10")
      setRandAds(rands)

      // console.log('HI')
    }
    fun()
  }, [submit])

  if (!user)
    navigate('/')

  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  const createNewAd = async (event) => {
    event.preventDefault()
    await adS.postAd(
      {
        title: adTitle,
        body: adBody,
        author: user.id
      },
    user.token)
    setAdBody('')
    setAdTitle('')
    setSubmit(!submit)
    setCreateOpen(!createOpen)
  }

  let showCreateDiv = {}
  let showCreatebutton = {}
  { createOpen ? showCreateDiv = { display: '' } : showCreateDiv = { display: 'none' } }
  { !createOpen ? showCreatebutton = { display: '' } : showCreatebutton = { display: 'none' } }

  return (
    <>
      <div style={{ backgroundColor: 'black' }} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads" style={{ backgroundColor: '#48c1df' }}>Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal</Link>
        <Link className='button' to="/home/settings">Settings</Link>
        <button className='button' style={{ float: 'right', backgroundColor: '#ff1a1a' }} onClick={logout} >Logout</button>
      </div>

      <div>

        {usrData && user ?
          <div className="container_home">
            <div className="column_left_home" style={{width: '50%'}}>
              <div className='usrInfoOuter' style={{ marginTop: '0' }}>
                <div className='usrInfoInner' style={{ width: '90%' }}>
                  <h1 style={{ textAlign: 'center' }}>My Ads:</h1>
                  <hr />
                  {usrData.ads.length ?
                        <div style={{whiteSpace: 'pre-line'}}>
                          <ul style={{paddingLeft: '0'}}>
                            {usrData.ads.map((ad) =>
                              <div className='forms' style={{width:'auto', textAlign:'left'}}>  
                                <div><Display_Ad id={ad} key={ad} token={user.token}/></div>
                              </div>
                            )}
                          </ul>
                        </div>
                        :
                        <div>
                          No ads yet :(
                        </div>
                      }
                  <hr />

                  <div style={{display:'flex', justifyContent: 'center'}}>
                     <div style={showCreatebutton}>
                        <button style={{float: '0 auto'}} className='savebtn' onClick={() => setCreateOpen(!createOpen)}>Create Ad</button>
                    </div>
                  </div>

                  <div className='creatediv' style={showCreateDiv}>
                    <h2 style={{ textAlign: 'center' }}>Create New</h2>
                    <hr />

                    <div>
                      <input style={{width: '100%', opacity: '0.7'}} placeholder='Title' value={adTitle} onChange={(event) => setAdTitle(event.target.value)} />
                      <textarea placeholder='Body' name="Text2" cols="40" rows="5" value={adBody} onChange={(event) => setAdBody(event.target.value)} ></textarea>
                      <br />
                      <button type='submit' className='savebtn' onClick={createNewAd}>Create Ad</button>
                      <button className='cancelbtn' onClick={() => {setCreateOpen(!createOpen)}}>Cancel</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="column_right_home" style={{width: '50%'}}>
              <div className='usrInfoOuter' style={{ marginTop: '0' }}>
                <div className='usrInfoInner' style={{ width: '95%' }}>
                  <h1 style={{ textAlign: 'center' }}>Ads:</h1>
                  <hr />

                    <h2 style={{ textAlign: 'center' }}>Your Network:</h2>
                    <hr />
                      {
                        netAds ?
                          <div>
                            {netAds.map((ad) =>
                              <ul style={{paddingLeft: '0'}}>  
                                <div><Display_Ad_Net ad={ad} key={Math.floor(Math.random() * 10)} usrid={user.id} token={user.token} useid={true}/></div>
                              </ul>
                            )}
                          </div>
                        
                        :
                          <div>
                            No ads yet
                          </div>
                      }
                    <hr />

                  <h2 style={{ textAlign: 'center' }}>You may also be interested:</h2>
                  <hr />
                      {
                        randAds && netAds ?
                          <div>
                            {randAds.filter((ad0) => {
                              if (ad0.author === user.id.toString() || netAds.some(n => n.author === ad0.author))
                                return false
                              else
                                return true
                            }).map((ad) =>
                              <ul style={{paddingLeft: '0'}}>  
                                <div><Display_Ad_Net ad={ad} key={Math.floor(Math.random() * 10)} usrid={user.id} token={user.token} useid={false}/></div>
                              </ul>
                            )}
                          </div>
                        
                        :
                          <div>
                            No ads yet
                          </div>
                      }
                </div>
              </div>
            </div>


          </div>
          : ''}

      </div>
    </>
  )
}

export default Ads