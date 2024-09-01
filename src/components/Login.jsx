import { useState } from 'react'
import Notification from './Notification'

const Login = ({ loginUser, msg }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div>
      <div className='logoDiv' >
        <a href='/' ><img src='../name.png' className='imageLogo' /></a>
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

export default Login