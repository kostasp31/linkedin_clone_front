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


const Login = ({ loginUser, msg }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div>
      <div className='logoDiv' >
        <a href='/' ><img src='../name.png' className='imageLogo'/></a>
      </div>
    
      <div className='formGrandpa'>
      <div className='formParent'>

        <div className='forms' >
          <h2 className='blk'>Sign In</h2>
          <form onSubmit={() => {
            loginUser(event, email, password)
            setEmail('')
            setPassword('')
          }}>
            <div >
              <input
                id='mail'
                type='text'
                className='loginInput'
                placeholder='example@mail.com'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                />
            </div>
            <div>
              <input
                id='pass'
                type='password'
                className='loginInput'
                placeholder='your_password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <div>
              Forgot password? Click <a href=''>here</a>
            </div>
            <br />
            <div>
              <button className='loginButton' type="submit">Sign in</button>
            </div>
            <br />
            <Notification message={msg} />
            <div>
              Don't have an account? <a href='/register'>Join Now</a>
            </div>
            <br />
          </form>
        </div>

      </div>  {/*Form parent */}
      </div>  {/*Form grandpa */}
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
      return
    }
    let regex = /^[A-Za-z]{3,32}$/; // Example regex pattern
    if (!regex.test(firstName) || !regex.test(lastName)) {
      setErrorMessage('Names must contain 3-32 valid letters')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return
    }
    regex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    if (!regex.test(email)) {
      setErrorMessage('Invalid email')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return
    }
    regex = /^[0-9]+$/;
    if (!regex.test(phone)) {
      setErrorMessage('Invalid phone number')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return
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
      <div className='logoDiv' >
        <a href='/' ><img src='../name.png' className='imageLogo'/></a>
      </div>
      <div className='formGrandpa'>
      <div className='formParent'>

      <div className='forms' style={{width: '400px'}}>
        <h2>Sign Up</h2>
        <p>Tell us some things about yourself</p>
        <form onSubmit={onRegister}>
          <div>
            <input
            placeholder='First name'
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>
          <div>
            <input
            placeholder='Last name'
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>
          <div>
            <input
              value={email}
              placeholder='Email'
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div> 
            <input
              placeholder='Phone number'
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </div>
          <div>
            <input
              placeholder='Password'
              value={password}
              type='password'
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div>
            <input
              placeholder='Confirm password'
              value={passwordConfirm}
              type='password'
              onChange={(event) => setPasswordConfirm(event.target.value)}
              required
            />
          </div>
          <br />  
          <div>
            <button className='loginButton' type="submit">Join PluggedIn</button>
          </div>
          <br />
          <Notification message={msg} />
          <p>Already have an account? <a href='/login'>Login</a></p>
        </form>
      </div>

      </div>  {/*Form parent */}
      </div>  {/*Form grandpa */}

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
      <div style={{backgroundColor  : 'rgba(0,0,0,0.5)'}} >
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
      <div style={{backgroundColor  : 'rgba(0,0,0,0.5)'}} >
        <Link className='button' to="/" style={{backgroundColor: '#48c1df'}} >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal Info</Link>
        <Link className='button' to="/home/settings">Settings</Link>
        <button className='button' style={{ float: 'right', backgroundColor: '#ff1a1a'}} onClick={logout} >Logout</button>
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
  const [usrData, setUsrData] = useState(null)
  const [userInf, setUserInf] = useState(null)
  
  const [cv, setCv] = useState('')
  const [editedCv, setEditedCv] = useState('')
  const [edit, setEdit] = useState(false)
  const [editText, setEditText] = useState('Edit')

  const [hobbies, setHobbies] = useState('')
  const [editedHobbies, setEditedHobbies] = useState('')
  const [editHobbies, setEditHobbies] = useState(false)
  const [editTextHobbies, setEditTextHobbies] = useState('Edit')

  const [exp, setExp] = useState('')
  const [editedExp, setEditedExp] = useState('')
  const [editExp, setEditExp] = useState(false)
  const [editTextExp, setEditTextExp] = useState('Edit')

  const [editGender, setEditGender] = useState(false)
  const [selectedGender, setSelectedGender] = useState('')
  const [gender, setGender] = useState('')

  useEffect(() => {
    const fun = async () => {
      const data = await dataS.userData(user.data.toString())
      setUsrData(data)

      setCv(data.bio)
      setEditedCv(data.bio)

      setExp(data.experience)
      setEditedExp(data.experience)

      setHobbies(data.hobbies)
      setEditedHobbies(data.hobbies)

      if (data.gender === 1)
        setGender('Male')
      else if (data.gender === 2)
        setGender('Female')

      const userInformation = await userS.userInfo(user.id.toString())
      setUserInf(userInformation)
      console.log(data)
    }
    fun()
  }, [])  // user.data ?

  const navigate = useNavigate()
  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  const updateCV = async () => {
    // console.log(user.data)
    const resp = await dataS.updateData(user.data.toString(), { bio: `${editedCv}` }, user.token)
    // console.log(resp)
    setEdit(!edit)
    setEditText('Edit')
    setCv(editedCv)
  }

  const updateHobbies = async () => {
    // console.log(user.data)
    const resp = await dataS.updateData(user.data.toString(), { hobbies: `${editedHobbies}` }, user.token)
    // console.log(resp)
    setEditHobbies(!editHobbies)
    setEditTextHobbies('Edit')
    setHobbies(editedHobbies)
  }

  const updateExperience = async () => {
    // console.log(user.data)
    const resp = await dataS.updateData(user.data.toString(), { experience: `${editedExp}` }, user.token)
    // console.log(resp)
    setEditExp(!editExp)
    setEditTextExp('Edit')
    setExp(editedExp)
  }
  
  const updateGender = async () => {
    if (!selectedGender)
      return
    console.log(selectedGender)
    const resp = await dataS.updateData(user.data.toString(), { gender: (selectedGender === 'Male' ? 1 : 2) }, user.token)
    setEditGender(!editGender)
    setGender(selectedGender)
  }

  let textBoxStyle = {}
  let bioBoxStyle = {}
  let textBoxStyleExp = {}
  let expBoxStyle = {}
  let textBoxStyleHob = {}
  let hobBoxStyle = {}

  let genderSelectorStyle = {}

  {edit ? textBoxStyle={ display: '' } : textBoxStyle={ display: 'none' } }
  {!edit ? bioBoxStyle={ display: '' } : bioBoxStyle={ display: 'none' } }

  {editExp ? textBoxStyleExp={ display: '' } : textBoxStyleExp={ display: 'none' } }
  {!editExp ? expBoxStyle={ display: '' } : expBoxStyle={ display: 'none' } }
  
  {editHobbies ? textBoxStyleHob={ display: '' } : textBoxStyleHob={ display: 'none' } }
  {!editHobbies ? hobBoxStyle={ display: '' } : hobBoxStyle={ display: 'none' } }

  {editGender ? genderSelectorStyle={ display: '' } : genderSelectorStyle={ display: 'none' } }
  // {!editHobbies ? hobBoxStyle={ display: '' } : hobBoxStyle={ display: 'none' } }
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
      <div>
        {(user && userInf) ?
        <div>
          <h2>Your info:</h2>
          <p>Name: {user.firstName} {user.lastName}</p>
          <p>Email: {user.email}</p>
          <p>Phone number: {userInf.phoneNumber ? <div>{userInf.phoneNumber}</div> : 'Not specified'}</p>
          <p>Address: {data.address ? <div>{data.address}</div> : 'Not specified'}</p>
          <p>Gender: {gender ? gender :  'Not specified' }<button onClick={() => setEditGender(!editGender)}>Change</button></p>
          
          <div style={genderSelectorStyle}>
          <form onSubmit={(event) => {
            event.preventDefault()
            updateGender()
          }} style={{ marginRight: '85%' }}>
            <fieldset>
              <legend>Select a gender:</legend>
              <div>
                <input type='radio' id='femaleRadio' name='drone' value='Female' onChange={(event) => {setSelectedGender(event.target.value)}} />
                <label for='femaleRadio'>Female</label>
              </div>
              <div>
                <input type='radio' id='maleRadio' name='drone' value='Male' onChange={(event) => {setSelectedGender(event.target.value)}} />
                <label for='maleRadio'>Male</label>
              </div>
              <button type='submit' style={{float: 'right'}}>Submit</button>
            </fieldset>
          </form>
          </div>


        </div>
        : ''}
        <h2>Your CV:</h2>
          <div style={bioBoxStyle} className='bioText' >
            {usrData ? 
              <div style={{whiteSpace: 'pre-line'}}>{cv}</div>
              : ''
            }
          </div>
          <div style={textBoxStyle}>
            <textarea name="Text1" cols="40" rows="5" value={editedCv} onChange={(event) => setEditedCv(event.target.value)}></textarea>
            <br />
          </div>
          <button onClick={updateCV} style={textBoxStyle} className='savebtn' >Save changes</button>
          <div style={{float: 'right'}}>
            <div style={textBoxStyle}>
              <input type="checkbox" />  This info is private
            </div>
          </div>
          <button className='cancelbtn' onClick={() => {
            setEdit(!edit)
            editText === 'Edit' ? setEditText('Cancel') : setEditText('Edit')
            setEditedCv(cv)
          }}>{editText}</button>

        <h2>Your Experience:</h2>
          <div style={expBoxStyle} className='bioText' >
            {usrData ? 
              <div style={{whiteSpace: 'pre-line'}}>{exp}</div>
              : ''
            }
          </div>
          <div style={textBoxStyleExp}>
            <textarea name="Text2" cols="40" rows="5" value={editedExp} onChange={(event) => setEditedExp(event.target.value)}></textarea>
            <br />
          </div>
          <button onClick={updateExperience} style={textBoxStyleExp} className='savebtn' >Save changes</button>
          <div style={{float: 'right'}}>
            <div style={textBoxStyleExp}>
              <input type="checkbox" />  This info is private
            </div>
          </div>
          <button className='cancelbtn' onClick={() => {
            setEditExp(!editExp)
            editTextExp === 'Edit' ? setEditTextExp('Cancel') : setEditTextExp('Edit')
            setEditedExp(exp)
          }}>{editTextExp}</button>

        <h2>Your Hobbies:</h2>
          <div style={hobBoxStyle} className='bioText' >
            {usrData ? 
              <div style={{whiteSpace: 'pre-line'}}>{hobbies}</div>
              : ''
            }
          </div>
          <div style={textBoxStyleHob}>
            <textarea name="Text3" cols="40" rows="5" value={editedHobbies} onChange={(event) => setEditedHobbies(event.target.value)}></textarea>
            <br />
          </div>
          <button onClick={updateHobbies} style={textBoxStyleHob} className='savebtn' >Save changes</button>
          <div style={{float: 'right'}}>
            <div style={textBoxStyleHob}>
              <input type="checkbox" />  This info is private
            </div>
          </div>
          <button className='cancelbtn' onClick={() => {
            setEditHobbies(!editHobbies)
            editTextHobbies === 'Edit' ? setEditTextHobbies('Cancel') : setEditTextHobbies('Edit')
            setEditedHobbies(hobbies)
          }}>{editTextHobbies}</button>
          
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
      <p>Kostas Petrakis & Filippos Papadimitriou, copyright 2024. All rights reserved &copy;</p>
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
