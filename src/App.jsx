import { useState, useEffect } from 'react'
import loginS from './services/login'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams, useNavigate,
  Navigate
} from 'react-router-dom'

const Login = ({ userName, handleNameChange, password, handlePasswordChange, loginUser, msg }) => {
  return (
    <div className='page'>
      <a href='/' ><img src='../name.png' className='logo' /></a>
      <Notification message={msg} />
      <div className='forms' >
        <h2 className='blk'>Sign In</h2>
        <form onSubmit={loginUser}>
          <div>
            Email: <input
              value={userName}
              onChange={handleNameChange} required
            />
          </div>
          <div>
            Password: <input
              value={password}
              type='password'
              onChange={handlePasswordChange} required
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

const SignUp = ({ userName, handleNameChange, password, handlePasswordChange, loginUser }) => {
  return (
    <div>
      <a href='/' ><img src='../name.png' className='logo' /></a>
      <div className='forms'>
        <h2>Sign Up</h2>
        <form onSubmit={loginUser}>
          <div>
            First name: <input
              value={userName}
              onChange={handleNameChange}
            />
          </div>
          <div>
            Last name: <input
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            Email: <input
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            Phone number: <input
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            Password: <input
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            Confirm password: <input
              value={password}
              onChange={handlePasswordChange}
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

const Welcome = () => {
  return (
    <>
      <div>
        <Link className='button' to="/">welcome</Link>
        <Link className='button' to="/login" style={{ float: 'right' }} >Login</Link>
        <Link className='button' to="/register" style={{ float: 'right' }}>Join Now</Link>
        <Link className='button' to="/home">home</Link>
      </div>
      {/* <img src='../name.png' /> */}
      <div>
        <button className='button1' >Sign in</button>
        <button className='button2' >Join now</button>
      </div>
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
      <div>
        <Link className='button' to="/">welcome</Link>
        <button className='button' style={{ float: 'right', backgroundColor: '#ff1a1a' }} onClick={logout} >Logout</button>
        <Link className='button' to="/home">home</Link>
      </div>
      {/* <img src='../name.png' /> */}
      <div>
        Welcome, {user.firstName} {user.lastName}!
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [newUserName, setNewUserName] = useState('')
  const [newPwassword, setNewPassword] = useState('')
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

  const handleNameChange = (event) => {
    // console.log(event.target.value)
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleNewNameChange = (event) => {
    // console.log(event.target.value)
    setNewUserName(event.target.value)
  }

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value)
  }

  const loginUser = async (event) => {
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
    setEmail('')
    setPassword('')
    return
  }

  const signUpUser = (event) => {
    event.preventDefault()
    setNewUserName('')
    setNewPassword('')
    return
  }

  return (
    <div className='all'>
      <Routes>
        <Route path="/" element={!user ? <Welcome /> : <Navigate replace to="/home" />} />
        <Route path="/login" element={
          <Login
            userName={email}
            password={password}
            handleNameChange={handleNameChange}
            handlePasswordChange={handlePasswordChange}
            loginUser={loginUser}
            msg={errorMessage}
          />
        } />
        <Route path="/register" element={
          <SignUp
            userName={newUserName}
            password={newPwassword}
            handleNameChange={handleNewNameChange}
            handlePasswordChange={handleNewPasswordChange}
            loginUser={signUpUser}
          />
        } />
        <Route path="/home" element={user ? <Home user={user} setUser={setUser} /> : <Navigate replace to="/login" />} />
      </Routes>
      {/* <Footer /> */}
    </div>
  )
}

export default App
