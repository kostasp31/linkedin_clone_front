import { useState } from 'react'
import registerS from '../services/register'
import Notification from './Notification'
import {
  useNavigate
} from 'react-router-dom'

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
    let regex = /^[A-Za-z]{3,32}$/
    if (!regex.test(firstName) || !regex.test(lastName)) {
      setErrorMessage('Names must contain 3-32 valid letters')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return
    }
    regex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
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
      // console.log(resp)
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
        <a href='/' ><img src='../name.png' className='imageLogo' /></a>
      </div>
      <div className='formGrandpa'>
        <div className='formParent'>

          <div className='forms' style={{ width: '400px' }}>
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
              <p>Already have an account? <u><a style={{color:'blue', cursor:'pointer'}} onClick={() => navigate('/login')}>Login</a></u></p>
            </form>
          </div>

        </div>  {/*Form parent */}
      </div>  {/*Form grandpa */}

    </div>
  )
}

export default SignUp