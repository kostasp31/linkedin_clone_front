import { useState, useEffect } from 'react'
import loginS from '../services/login'
import userS from '../services/user'
import {
  Link, useNavigate
} from 'react-router-dom'
import Notification from './Notification'

const Settings = ({ user, setUser, msg, setMsg, msg1, setMsg1 }) => {
  const [editEmail, setEditEmail] = useState(false)
  const [email, setEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')

  const [pass, setPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [verifyPass, setVerifyPass] = useState('')

  useEffect(() => {
    const fun = async () => {
      setEmail(user.email)
      setNewEmail(user.email)
      setMsg(null)
      setMsg1(null)
    }
    fun()
  }, [])

  const navigate = useNavigate()
  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  const changeEmail = async (event) => {
    // TODO CHECK REGEX  OK
    event.preventDefault()
    const regex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
    if (!regex.test(newEmail)) {
      setMsg1('Invalid email')
      clearTimeout()
      setTimeout(() => {
        setMsg1(null)
      }, 3000)
      return
    }

    if (newEmail === email) {
      setEditEmail(!editEmail)
      return
    }
    setEmail(newEmail)
    setEditEmail(!editEmail)
    const resp = await userS.updateUserInfo(user.id.toString(), { email: newEmail }, user.token)
    // console.log(resp.data)
  }

  const changePass = async () => {
    if (newPass.length < 3) {
      setMsg('New password is too short')
      clearTimeout()
      setTimeout(() => {
        setMsg(null)
      }, 3000)
      return
    }
    if (newPass !== verifyPass) {
      setMsg('New passwords do not match')
      clearTimeout()
      setTimeout(() => {
        setMsg(null)
      }, 3000)
      return
    }
    if (newPass === pass) {
      setMsg('Current and new passwords match')
      clearTimeout()
      setTimeout(() => {
        setMsg(null)
      }, 3000)
      return
    }

    try {
      const resp = await loginS.changePassword({ pass: pass, newPass: newPass }, user.token)
    }
    catch (exception) {
      setMsg(exception.response.data.error)
      clearTimeout()
      setTimeout(() => {
        setMsg(null)
      }, 3000)
      return
    }
    logout()
  }

  let showChangeEmail = {}
  { editEmail ? showChangeEmail = { display: '' } : showChangeEmail = { display: 'none' } }

  return (
    <div>
      <div style={{ backgroundColor: 'black' }} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal</Link>
        <Link className='button' to="/home/settings" style={{ backgroundColor: '#48c1df' }}>Settings</Link>
        <button className='button' style={{ float: 'right', backgroundColor: '#ff1a1a' }} onClick={logout} >Logout</button>
      </div>

      <div>
        <div>
          {(user) ?
            <div>

              <div className='usrInfoOuter'>
                <div className='usrInfoInner'>
                  <div style={{ marginLeft: '8%', marginRight: '8%' }}>
                    <h2 style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>Change Email:</h2><hr />
                    <h3>Your Email: {email} <button className='buttonChange' onClick={() => setEditEmail(!editEmail)} style={{ float: 'right' }}>Change</button></h3>

                    <div style={showChangeEmail}>
                      <div className='forms' style={{ textAlign: 'center', marginBottom: '1%' }}>
                        <form onSubmit={(event) => changeEmail(event)}>
                          <h2>New address:</h2>
                          <input type='text' value={newEmail} onChange={(event) => setNewEmail(event.target.value)} style={{ margin: 'auto', border: '1px solid #367AF6' }} /><br /><br />
                          <Notification message={msg1} />
                          {msg1 ? <br /> : ''}
                          <button type='submit' className='buttonChange' style={{ background: 'linear-gradient(180deg, #4B91F7 0%, #da42a0 100%)', margin:'0 auto' }}>Update Email</button>
                        </form>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div className='usrInfoOuter'>
                <div className='usrInfoInner'>
                  <div style={{ marginLeft: '8%', marginRight: '8%' }}>
                    <h2 style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>Change Password:</h2><hr />
                    <h4>Please submit the following form:</h4>

                    <div className='forms' >
                      <form onSubmit={(event) => {
                        event.preventDefault()
                        changePass()
                      }}>
                        <h2>Change</h2>
                        <div >
                          <input
                            id='mail'
                            type='password'
                            placeholder='Current password'
                            value={pass}
                            onChange={(event) => setPass(event.target.value)}
                            required
                          />
                        </div>
                        <div >
                          <input
                            id='mail'
                            type='password'
                            placeholder='New password'
                            value={newPass}
                            onChange={(event) => setNewPass(event.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <input
                            id='pass'
                            type='password'
                            placeholder='Verify new password'
                            value={verifyPass}
                            onChange={(event) => setVerifyPass(event.target.value)}
                            required
                          />
                        </div>
                        <br />
                        <Notification message={msg} />
                        {msg ? <br /> : ''}
                        <div>
                          {/* <button className='buttonChange' type="submit">Change Password</button> */}
                          <button className='buttonChange' type="submit" style={{margin: '0 auto', background: 'linear-gradient(rgb(75, 145, 247) 0%, rgb(218, 66, 160) 100%)'}}>Change Password</button>
                        </div>
                        <br />
                      </form>
                    </div>
                    <br />
                    <h4 style={{margin: '0 auto'}}>Notice; this action will log you off the application</h4>

                  </div>
                </div>
              </div>

            </div>
            : ''}
        </div>
      </div>
    </div>
  )
}

export default Settings