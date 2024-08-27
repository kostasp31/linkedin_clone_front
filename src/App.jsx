import { useState, useEffect } from 'react'
import loginS from './services/login'

const Login = ({ userName, handleNameChange, password, handlePasswordChange, loginUser, showLogin }) => {
  if (showLogin) {
    return (
      <div>
        <h2>Sign In</h2>
        <form onSubmit={loginUser}>
          <div>
            Username: <input
              value={userName}
              onChange={handleNameChange}
            />
          </div>
          <div>
            Password: <input
              value={password}
              type='password'
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            <button type="submit">login</button>
          </div>
        </form>
      </div>
    )
  }
  else {
    return null
  }
}

const SignUp = ({ userName, handleNameChange, password, handlePasswordChange, loginUser, showSignup }) => {
  if (showSignup) {
    return (
      <div>
        <h2>Sign Up</h2>
        <form onSubmit={loginUser}>
          <div>
            Username: <input
              value={userName}
              onChange={handleNameChange}
            />
          </div>
          <div>
            Password: <input
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            <button type="submit">Join LinkedOut</button>
          </div>
        </form>
      </div>
    )
  }
  else {
    return null
  }
}

const Notification = ({message}) => {
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

const App = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [newPwassword, setNewPassword] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  
  const [user, setUser] = useState(null)

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

  if (user === null) {
    return (
      <>
        <h1>Linkedout</h1>
        <Notification message={errorMessage} />
        <div>
          <ul>
            <li>
              <button onClick={() => { setShowLogin(!showLogin) }}>Sign in</button>
            </li>
            <li>
              <button onClick={() => { setShowSignup(!showSignup) }}>Join now</button>
            </li>
          </ul>
          <Login
            userName={email}
            password={password}
            handleNameChange={handleNameChange}
            handlePasswordChange={handlePasswordChange}
            loginUser={loginUser}
            showLogin={showLogin}
          />
          <SignUp
            userName={newUserName}
            password={newPwassword}
            handleNameChange={handleNewNameChange} 
            handlePasswordChange={handleNewPasswordChange}
            loginUser={signUpUser}
            showSignup={showSignup}
          />
        </div>
      </>
    )
  }

  return (
      <>
        <h1>Linkedout</h1>
        <div>
          {user.firstName} is logged in
          <button onClick={() => {window.localStorage.clear(); setUser(null)}}>Logout</button>
        </div>
      </>
    )
  }

export default App
