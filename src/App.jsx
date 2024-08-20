import { useState } from 'react'

const Login = ({userName, handleNameChange, password, handlePasswordChange, loginUser, showLogin}) => {
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

const SignUp = ({userName, handleNameChange, password, handlePasswordChange, loginUser, showSignup}) => {
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

const App = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [newPwassword, setNewPassword] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  const handleNameChange = (event) => {
    // console.log(event.target.value)
    setUserName(event.target.value)
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

  const loginUser = (event) => {
    event.preventDefault()
    setUserName('')
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
    <>
      <h1>Linkedout</h1>
      <ul>
        <li>
          <button onClick={() => {setShowLogin(!showLogin)}}>Sign in</button>
        </li>
        <li>
          <button onClick={() => {setShowSignup(!showSignup)}}>Join now</button>
        </li>
      </ul>
      <Login userName={userName} password={password} handleNameChange={handleNameChange} handlePasswordChange={handlePasswordChange} loginUser={loginUser} showLogin={showLogin}/>
      <SignUp userName={newUserName} password={newPwassword} handleNameChange={handleNewNameChange} handlePasswordChange={handleNewPasswordChange} loginUser={signUpUser} showSignup={showSignup}/>
    </>
  )
}

export default App
