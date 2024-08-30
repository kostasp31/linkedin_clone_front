import { useState, useEffect } from 'react'
import loginS from './services/login'
import registerS from './services/register'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams, useNavigate,
  Navigate
} from 'react-router-dom'

const Login = ({ loginUser, msg }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className='page'>
      <a href='/' ><img src='../name.png' className='logo' /></a>
      <Notification message={msg} />
      <div className='forms' >
        <h2 className='blk'>Sign In</h2>
        <form onSubmit={() => {
          loginUser(event, email, password)
          setEmail('')
          setPassword('')
        }}>
          <div>
            Email: <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            Password: <input
              value={password}
              type='password'
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit">login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const SignUp = ({ setErrorMessage, msg }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const navigate = useNavigate()

  const onRegister = async (event) => {
    event.preventDefault()
    if (password !== passwordConfirm) {
      setErrorMessage('Passwords do not match')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)      
    }

    try {
      const resp = await registerS.register(
        {
          "firstName": firstName,
          "lastName": lastName,
          "email": email,
          "phoneNumber": phone,
          "password": password,
          "pfp": ''
        }
      )
      console.log(resp)
      setFirstName('')
      setLastName('')
      setPhone('')
      setEmail('')
      setPassword('')
      setPasswordConfirm('')
      navigate('/login')

    } catch (exception) {
      setErrorMessage(exception.response.data.error)   // TODO: CHECK BACKEND ERROR
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  return (
    <div>
      <a href='/' ><img src='../name.png' className='logo' /></a>
      <Notification message={msg} />
      <div className='forms'>
        <h2>Sign Up</h2>
        <form onSubmit={onRegister}>
          <div>
            First name: <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              pattern="[A-Za-z]{3,32}"
              required
            />
          </div>
          <div>
            Last name: <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              pattern="[A-Za-z]{3,32}"
              required
            />
          </div>
          <div>
            Email: <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              pattern="[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+"
              required
            />
          </div>
          <div>
            Phone number: <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </div>
          <div>
            Password: <input
              value={password}
              type='password'
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div>
            Confirm password: <input
              value={passwordConfirm}
              type='password'
              onChange={(event) => setPasswordConfirm(event.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit">Join LinkedOut</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null)
    return null
  else {
    return (
      <div className='error'>
        {message}
      </div>
    )
  }
}

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
      <div>
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
      <div style={{backgroundColor  : 'black'}} >
        <Link className='button' to="/" style={{backgroundColor: '#48c1df'}} >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal Info</Link>
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
      <div style={{backgroundColor  : 'black'}} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network" style={{backgroundColor: '#48c1df'}}>Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal Info</Link>
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
      <div style={{backgroundColor  : 'black'}} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads" style={{backgroundColor: '#48c1df'}}>Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal Info</Link>
        <Link className='button' to="/home/settings">Settings</Link>
        <button className='button' style={{ float: 'right', backgroundColor: '#ff1a1a' }} onClick={logout} >Logout</button>
      </div>
      {/* <img src='../name.png' /> */}
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
      <div style={{backgroundColor  : 'black'}} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages" style={{backgroundColor: '#48c1df'}}>Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal Info</Link>
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
      <div style={{backgroundColor  : 'black'}} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications" style={{backgroundColor: '#48c1df'}}>Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal Info</Link>
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

const Personal = ({ user, setUser }) => {
  const navigate = useNavigate()
  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  return (
    <>
      <div style={{backgroundColor  : 'black'}} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info" style={{backgroundColor: '#48c1df'}}>Personal Info</Link>
        <Link className='button' to="/home/settings">Settings</Link>
        <button className='button' style={{ float: 'right', backgroundColor: '#ff1a1a' }} onClick={logout} >Logout</button>
      </div>
      {/* <img src='../name.png' /> */}
      <div>
        Your info
      </div>
    </>
  )
}

const Settings = ({ user, setUser }) => {
  const navigate = useNavigate()
  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  return (
    <>
      <div style={{backgroundColor  : 'black'}} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal Info</Link>
        <Link className='button' to="/home/settings" style={{backgroundColor: '#48c1df'}}>Settings</Link>
        <button className='button' style={{ float: 'right', backgroundColor: '#ff1a1a' }} onClick={logout} >Logout</button>
      </div>
      {/* <img src='../name.png' /> */}
      <div>
        Your settings
      </div>
    </>
  )
}

const Footer = () => {
  return (
    <div className='footer'>
      This is a summer project for tedi
      {/* <p>Kostas Petrakis & Filippos Papadimitriou, copyright 2024. All rights reserved &copy;</p> */}
    </div>
  )
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
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
        <Route path="/home/settings" element={user ? <Settings user={user} setUser={setUser} /> : <Navigate replace to="/login" />} />
      </Routes>
      {/* <Footer /> */}
    </div>
  )
}

export default App
