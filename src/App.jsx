import { useState, useEffect } from 'react'
import loginS from './services/login'
import dataS from './services/data'
import {
  Routes, Route, useNavigate,
  Navigate
} from 'react-router-dom'
import Personal from './components/Personal'
import Network from './components/Network'
import Notifications from './components/Notifications'
import Settings from './components/Settings'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Welcome from './components/Welcome'
import Messages from './components/Messages'
import BlogInfo from './components/Blog_Info'
import Home from './components/Home'
import Ads from './components/Ads'
import UserInfo from './components/User_Info'
import Admin_Page from './components/Admin'

const About = () => {
  return (
    <div>
      About page
    </div>
  )
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorMessage1, setErrorMessage1] = useState(null)
  const [user, setUser] = useState(null)
  const [usrData, setUserData] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      // noteService.setToken(user.token)
      navigate('/home')
    }
    const fun = async () => {
      if (user) {
        const data = await dataS.userData(user.data.toString())
        setUserData(data)
      }
    }
    fun()
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

      if (email === 'root@tree.org')
        navigate('/admin')
      else
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
        <Route path="/profile/:id" element={<UserInfo ogUser={user} ogData={usrData} />} />
        <Route path="/blogs/:id" element={<BlogInfo user={user} />} />
        <Route path="/admin" element={<Admin_Page user={user} setuser={setUser} />} />
      </Routes>
      {/* <Footer /> */}
    </div>
  )
}

export default App
