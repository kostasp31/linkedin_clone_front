import { useState, useEffect } from 'react'
import dataS from '../services/data'
import userS from '../services/user'
import {
  Link, useNavigate
} from 'react-router-dom'


const OneConnected = ({ user, usrData, pr }) => {
  const [persn, setPersn] = useState('')
  const [prData, setPrData] = useState('')
  const navigate = useNavigate()
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
  
  const printPfP = () => {
    if (pr.pfp === null) {
      return ('no pfp')
    } else {
      return (<img style={{ float: 'right', width: '10%' }} src={persn.pfp} />)
    }
  }
  
  const printWorks = () => {
    if (prData.works === null) {
      return ('Not specified')
    } else {
      return (prData.works)
    }
  }
  
  const printPos = () => {
    if (prData.position === null) {
      return ('Not specified')
    } else {
      return (prData.position)
    }
  }
  
  const removeHandler = async () => {
    setPersn('')
    await dataS.deleteData(usrData.id, 'network', persn.id, user.token) // remove from both networks
    await dataS.deleteDataNp(prData.id, 'network', user.id)
  }

  if (persn) {
    return (
      <div>
        <hr />
        <h2>{persn.firstName} {persn.lastName} {printPfP()} </h2>
        <h3>Works in: {printWorks()}</h3>
        <h3>Current position: {printPos()}</h3>
        <button className='savebtn' onClick={() => { navigate(`/profile/${pr}`) }}>Visit Profile</button>
        <button className='cancelbtn' onClick={removeHandler} >Remove from Network</button>
      </div>
    )
  }
}

const SearchResult = ({ user, usrData, result }) => {
  const navigate = useNavigate()

  const [persn, setPersn] = useState('')
  const [prData, setPrData] = useState('')
  const [showSend, setShowSend] = useState(true)
  useEffect(() => {
    const fun = async () => {
      const person = await userS.userInfo(result.id)
      setPersn(person)
      // console.log(persn)
      
      const personData = await dataS.userData(person.userData.toString())
      setPrData(personData)
      // console.log(usrData.network.includes(result.id))
      if (usrData.network.includes(result.id)){  
        setShowSend(false)                                  
      }
      if(usrData.requestsSent.includes(result.id)){
        setShowSend(false)
      }
      if(usrData.requestsReceived.includes(result.id)){
        setShowSend(false)
      }
    }
    fun()
  }, [])


  const sendHandler = async () => {
    if (prData){
      await dataS.updateData(usrData.id, {requestsSent: `${persn.id}`}, user.token)
      await dataS.updateDataNp(prData.id, {requestsReceived: `${user.id}`})
      usrData.requestsSent = usrData.requestsSent.concat(persn.id)
      setShowSend(false)
    }
  }

  return (
    <div>
      <hr />
      {result.fullName}
      <button 
        className='savebtn'
        style={{float:'right', paddingTop:'4px', paddingBottom:'4px', paddingLeft:'6px', paddingRight:'6px'}} 
        onClick={() => { navigate(`/profile/${result.id}`) }}>
        Visit Profile
      </button>
      {showSend ?
        <button 
          className='savebtn'
          style={{background:'green', float:'right', paddingTop:'4px', paddingBottom:'4px', paddingLeft:'6px', paddingRight:'6px'}}
          onClick={sendHandler}>
          Send network request
        </button>
      : ''}
    </div>
  )
}

const Network = ({ user, setUser }) => {
  
  const [usrData, setUsrData] = useState(null)
  const [newSearch, setNewSearch] = useState('')
  const [searchList, setSearchList] = useState([])

  useEffect(() => {
    const fun = async () => {
      const data = await dataS.userData(user.data.toString())
      setUsrData(data)

      const allUsers = await userS.getAllUserData(user.token)
      let fullNames = []
      for (let usr of allUsers) {
        fullNames.push({ fullName: usr.firstName + ' ' + usr.lastName, id: usr.id })
      }
      setSearchList(fullNames)
    }
    fun()
  }, [])

  const navigate = useNavigate()
  if (!user)
    navigate('/')
  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  return (
    <>
      <div style={{ backgroundColor: 'black' }} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network" style={{ backgroundColor: '#48c1df' }}>Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal</Link>
        <Link className='button' to="/home/settings">Settings</Link>
        <button className='button' style={{ float: 'right', backgroundColor: '#ff1a1a' }} onClick={logout} >Logout</button>
      </div>

      <div>
        {usrData && user ?
          <div className='container_home'>
            <div className='column_left_home' style={{ width: '30%' }}>
              <div className='usrInfoOuter' style={{ marginTop: '0' }}>
                <div className='usrInfoInner' style={{ width: '90%' }}>
                  <h1 style={{ textAlign: 'center' }}>SEARCH</h1>
                  <h2 style={{ textAlign: 'center' }}>Search users by name<br />
                    <input style={{ width: '100%' }} value={newSearch} onChange={(event) => setNewSearch(event.target.value)} />
                  </h2>
                  <ul>
                    {searchList.map((res) =>{
                      if (res.fullName.toLowerCase().includes(newSearch.toLowerCase()) && newSearch && res.id !== user.id)
                        return (<SearchResult user={user} usrData={usrData} result={res} key={res.id} />)
                      }
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className='column_right_home'>
              <div className='usrInfoOuter' style={{ marginTop: '0' }}>
                <div className='usrInfoInner' style={{ width: '100%' }}>
                  <h1 style={{ textAlign: 'center' }}>MY NETWORK</h1>
                  {usrData.network.length ?
                    <ul>
                      {usrData.network.map((person) =>
                        <OneConnected user={user} usrData={usrData} pr={person} key={person} />
                      )}
                    </ul>
                    :
                    <div>Network empty</div>
                  }
                </div>
              </div>
            </div>
          </div>
          : 'ERROR'}
      </div>
    </>
  )
}

export default Network