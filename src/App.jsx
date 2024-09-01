import { useState, useEffect } from 'react'
import loginS from './services/login'
import registerS from './services/register'
import dataS from './services/data'
import userS from './services/user'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams, useNavigate,
  Navigate
} from 'react-router-dom'
import data from './services/data'
import Personal from './components/Personal'
import Notification from './components/Notification'
import Settings from './components/Settings'
import Login from './components/Login'
import SignUp from './components/SignUp'

const About = () => {
  return (
    <div>
      About page
    </div>
  )
}

const Welcome = () => {
  return (
    <>
      <div style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} >
        <Link className='button' to="/login" style={{ float: 'right' }} >Login</Link>
        <Link className='button' to="/register" style={{ float: 'right' }}>Join Now</Link>
        <Link className='button' to="/about">about</Link>
      </div>
      {/* <img src='../name.png' /> */}
    </>
  )
}

const Home = ({ user, setUser }) => {
  const navigate = useNavigate()
  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  return (
    <>
      <div style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} >
        <Link className='button' to="/" style={{ backgroundColor: '#48c1df' }} >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal</Link>
        <Link className='button' to="/home/settings">Settings</Link>
        <button className='button' style={{ float: 'right', backgroundColor: '#ff1a1a' }} onClick={logout} >Logout</button>
      </div>
      {/* <img src='../name.png' /> */}
      <div>
        Welcome, {user.firstName} {user.lastName}!
      </div>
    </>
  )
}

const Network = ({ user, setUser }) => {
  const navigate = useNavigate()
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
      {/* <img src='../name.png' /> */}
      <div>
        Your network
      </div>
    </>
  )
}

const Ads = ({ user, setUser }) => {
  const navigate = useNavigate()
  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

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
        Your ads
      </div>
    </>
  )
}

const Messages = ({ user, setUser }) => {
  const navigate = useNavigate()
  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  return (
    <>
      <div style={{ backgroundColor: 'black' }} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages" style={{ backgroundColor: '#48c1df' }}>Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal</Link>
        <Link className='button' to="/home/settings">Settings</Link>
        <button className='button' style={{ float: 'right', backgroundColor: '#ff1a1a' }} onClick={logout} >Logout</button>
      </div>
      {/* <img src='../name.png' /> */}
      <div>
        Your messages
      </div>
    </>
  )
}

const Notifications = ({ user, setUser }) => {
  const navigate = useNavigate()
  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

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
      {/* <img src='../name.png' /> */}
      <div>
        Your notif
      </div>
    </>
  )
}

const Footer = () => {
  return (
    <div className='footer'>
      <p>Kostas Petrakis & Filippos Papadimitriou, copyright 2024. All rights reserved &copy;</p>
    </div>
  )
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorMessage1, setErrorMessage1] = useState(null)
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      // noteService.setToken(user.token)
    }
  }, [])

  const loginUser = async (event, email, password) => {
    event.preventDefault()

    try {
      const user = await loginS.login(
        {
          "email": email,
          "password": password
        }
      )
      setUser(user)
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      navigate('/home')

    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
    return
  }

  return (
    <div className='all'>
      <Routes>
        <Route path="/" element={!user ? <Welcome /> : <Navigate replace to="/home" />} />
        <Route path="/login" element={
          <Login
            loginUser={loginUser}
            msg={errorMessage}
          />
        } />
        <Route path="/register" element={<SignUp setErrorMessage={setErrorMessage} msg={errorMessage} />} />
        <Route path="/about" element={<About />} />
        <Route path="/home" element={user ? <Home user={user} setUser={setUser} /> : <Navigate replace to="/login" />} />
        <Route path="/home/network" element={user ? <Network user={user} setUser={setUser} /> : <Navigate replace to="/login" />} />
        <Route path="/home/ads" element={user ? <Ads user={user} setUser={setUser} /> : <Navigate replace to="/login" />} />
        <Route path="/home/messages" element={user ? <Messages user={user} setUser={setUser} /> : <Navigate replace to="/login" />} />
        <Route path="/home/notifications" element={user ? <Notifications user={user} setUser={setUser} /> : <Navigate replace to="/login" />} />
        <Route path="/home/personal_info" element={user ? <Personal user={user} setUser={setUser} /> : <Navigate replace to="/login" />} />
        <Route path="/home/settings" element={user ? <Settings user={user} setUser={setUser} msg={errorMessage} setMsg={setErrorMessage} msg1={errorMessage1} setMsg1={setErrorMessage1} /> : <Navigate replace to="/login" />} />
      </Routes>
      {/* <Footer /> */}
    </div>
  )
}

export default App
