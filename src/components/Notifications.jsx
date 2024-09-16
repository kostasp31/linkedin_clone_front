import { useState, useEffect } from 'react'
import loginS from '../services/login'
import registerS from '../services/register'
import dataS from '../services/data'
import userS from '../services/user'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams, useNavigate,
  Navigate
} from 'react-router-dom'

const SentRequest = ({user, usrData, token, pr}) => {
  const [persn, setPersn] = useState('')
  const [prData, setPrData] = useState('')
  useEffect(() => {
    const fun = async () => {
      const person = await userS.userInfo(pr)
      setPersn(person)
      // console.log(persn)
      
      const personData = await dataS.userData(person.userData.toString())
      setPrData(personData)
      // console.log(prData)
    }
    fun()
  }, [])

  const cancelHandler = async () => {
    setPersn('')
    await dataS.deleteData(usrData.id, 'requestsSent', persn.id, token)
    await dataS.deleteDataNp(prData.id, 'requestsReceived', user.id)
  }

  if(persn){
    return(
      <li style={{width:'100%', marginLeft:'10px', marginBottom:'10px'}}>
        <div style={{paddingRight:'0'}}>
          <b>{persn.firstName} {persn.lastName}</b> 
          <button 
            className='savebtn'
            style={{background:'red', padding:'5px', float:'right', paddingBottom:'3px'}}
            onClick={cancelHandler}
          >
          Cancel
          </button>
        </div>
      </li>
    )
  }
}

const ReceivedRequest = ({user, usrData, token, pr}) => {

  const [persn, setPersn] = useState('')
  const [prData, setPrData] = useState('')
  useEffect(() => {
    const fun = async () => {
      const person = await userS.userInfo(pr)
      setPersn(person)
      // console.log(persn)
      
      const personData = await dataS.userData(person.userData.toString())
      setPrData(personData)
      // console.log(prData)
    }
    fun()
  }, [])

  const acceptHandler = async () => {
    setPersn('')
    await dataS.deleteData(usrData.id, 'requestsReceived', persn.id, token) // remove the request from receiver
    await dataS.updateData(usrData.id, {network: `${persn.id}`}, token)     // add to his network
    await dataS.deleteDataNp(prData.id, 'requestsSent', user.id)            // remove the request from sender
    await dataS.updateDataNp(prData.id, {network: `${user.id}`})            // add to his network
  }

  const declineHandler = async () => {
    setPersn('')
    await dataS.deleteData(usrData.id, 'requestsReceived', persn.id, token) // remove the request from receiver
    await dataS.deleteDataNp(prData.id, 'requestsSent', user.id)            // remove the request from sender
  }

  if (persn){
    return (
      <div style={{width:'100%'}}>
        <hr />
        <div style={{paddingRight:'0'}}>
          <b>{persn.firstName} {persn.lastName}</b> sent you a network request.
          <button 
            className='savebtn'
            onClick={declineHandler}
            style={{background:'red',padding:'5px', float:'right', paddingBottom:'3px'}}>Decline</button>
          <button 
            className='savebtn'
            style={{background:'green', padding:'5px', float:'right', paddingBottom:'3px'}}
            onClick={acceptHandler}
          >
          Accept
          </button>
        </div>
      </div>
    )
  }
}

const Notifications = ({ user, setUser }) => {
  const navigate = useNavigate()
  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  const [usrData, setUserData] = useState(null)
  useEffect(() => {
    const fun = async () => {
      const data = await dataS.userData(user.data.toString())
      setUserData(data)
    }
    fun()
  },[])

  return (
    <>
      <div style={{ backgroundColor: 'black' }} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications" style={{ backgroundColor: '#48c1df' }}>Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal</Link>
        <Link className='button' to="/home/settings">Settings</Link>
        <button className='button' style={{ float: 'right', backgroundColor: '#ff1a1a' }} onClick={logout} >Logout</button>
      </div>
      <div>
        {usrData && user ?
          <div>
            <h1 style={{textAlign:'center'}}>MY NOTIFICATIONS</h1>
            <div className='container_home' style={{marginTop:'0'}}>
              <div className='column_left_home' style={{width:'70%', marginRight:'25px'}}>
                <div className='usrInfoOuter'>
                  <div className='usrInfoInner' style={{width:'100%'}}>
                    <h2 style={{textAlign:'center'}}>NETWORK REQUESTS RECEIVED</h2>
                    {usrData.requestsReceived.length ?
                      <ul>
                        {usrData.requestsReceived.map((person) =>
                          <ReceivedRequest user={user} usrData={usrData} token={user.token} pr={person} key={person} />
                        )}
                      </ul>
                    : <div>You have no new network requests</div>
                    }
                  </div>
                </div>
              </div>
              <div className='column_right_home' style={{width:'30%', marginTop:'15px'}}>
                <div className='usrInfoOuter'>
                  <div className='usrInfoInner' style={{width:'100%'}}>
                    <h2 style={{textAlign:'center'}}>NETWORK REQUESTS SENT</h2>
                    {usrData.requestsSent.length ?
                      <ul>
                        {usrData.requestsSent.map((person) =>
                          <SentRequest user={user} usrData={usrData} token={user.token} pr={person} key={person} />
                        )}
                      </ul>
                    : <div>You have no pending requests</div>
                    }
                  </div>
                </div>      
              </div>
            </div>
          </div>
        : 'ERROR'}
      </div>
    </>
  )
}



export default Notifications