import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import dataS from '../services/data'
import userS from '../services/user'
import chatS from '../services/chat'
import {
  Link, useNavigate
} from 'react-router-dom'
import moment from 'moment'

const Messages = ({ user, setUser }) => {
  const [userData, setUsrData] = useState(null)
  const [allChats, setChats] = useState([])
  const [allChatsInfo, setChatsInfo] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [activeUser, setActiveUser] = useState(null)
  const [myData, setMyData] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [upd, setUpd] = useState(false)
  const navigate = useNavigate()

  const location = useLocation()

  const timerRef = useRef(null);
  const fun = async () => {
    // console.log('updatedddddddddddddddddd')
    const data = await dataS.userData(user.data.toString())
    setUsrData(data)


    const chatDataPromises = data.chats.map(async (chat) => {
      const chatData = await chatS.getChat(chat)
      return chatData
    })
    const chatDataArray = await Promise.all(chatDataPromises)
    setChats(chatDataArray)
    // console.log(chatDataArray)

    const chatInfoPromises = chatDataArray.map(async (chat) => {
      let chatInfo
      if (chat.person1 === user.id)
        chatInfo = await userS.userInfo(chat.person2)
      else
        chatInfo = await userS.userInfo(chat.person1)
      return chatInfo
    })
    const chatInfoArray = await Promise.all(chatInfoPromises)
    setChatsInfo(chatInfoArray)

    const mydata = await userS.userInfo(user.id.toString())
    setMyData(mydata)

  }

  useEffect(() => {
    fun()
    // timerRef.current = setInterval(() => {
    //   // console.log('This will run every 1 second!')
    // }, 2000)
    // return () => {
    //   clearInterval(timerRef.current)
    // }

  }, [activeChat])

  useEffect(() => {
    const fun  = async() => {
      if (location.state && allChatsInfo.length) {
        const actProp = location.state.active
        const ch = allChatsInfo.find(obj => obj.id === actProp)

        console.log('ALL', allChatsInfo)
        console.log('CH', ch)
        console.log('ACT', actProp)
        if (!ch) {
          try {
            await userS.userInfo(actProp)
          }
          catch (exc) {
            console.log(exc)
          }
        }

        if (ch)
          usrClick(ch)
      }
    }
    fun()
  }, [allChatsInfo])


  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  const usrClick = (ch) => {
    location.state = null
    const selectedChat = allChats.find(obj => obj.person1 === ch.id || obj.person2 === ch.id)
    setActiveChat(selectedChat)
    // console.log('selchat', selectedChat)
    // console.log('all', allChatsInfo)

    const selectedUsr = allChatsInfo.find(obj => obj.id === selectedChat.person1 || obj.id === selectedChat.person2)
    setActiveUser(selectedUsr)
    // console.log('selusr', selectedUsr)
  }

  const sendMessage = () => {
    if (/^\s*$/.test(newMessage)) {
      setNewMessage('')
      return
    }
    chatS.updateChat(activeChat.id, { body: newMessage }, user.token)
    // setUpd(!upd)

    let msgs = activeChat.messages
    msgs = msgs.concat({ body: newMessage, user: user.id })
    // console.log(msgs)

    let newActive = activeChat
    newActive.messages = msgs
    setActiveChat(newActive)
    // console.log(newActive)

    setNewMessage('')
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

      <div>

        <div className="container_home">
          <div className="column_left_home" style={{ width: '20%' }}>
            <div className='usrInfoOuter' style={{ marginTop: '0' }}>
              <div className='usrInfoInner' style={{ width: '95%', overflowY: 'scroll', height: '80vh' }}>
                <h1 style={{ textAlign: 'center' }}>Contacts:</h1>
                <hr />

                {allChats.length ?
                  allChatsInfo.map((ch) => {
                    if (activeUser) {
                      return (
                        <div style={{ marginBottom: '5px' }}>
                          <div className={activeUser.id === ch.id ? 'savebtn1' : 'savebtn'} style={{ textAlign: 'center' }} onClick={() => usrClick(ch)}>
                            {ch.firstName} {ch.lastName}
                          </div>
                        </div>
                      )
                    }
                    else {
                      return (
                        <div style={{ marginBottom: '5px' }}>
                          <div className='savebtn' style={{ textAlign: 'center' }} onClick={() => usrClick(ch)}>
                            {ch.firstName} {ch.lastName}
                          </div>
                        </div>
                      )

                    }
                  })
                  : 'Loading'}

              </div>
            </div>
          </div>

          <div className="column_right_home" style={{ width: '100%' }}>
            {activeChat && activeUser && myData ? (
              <div className='usrInfoInner' style={{ width: '100%', border: 'none' }}>
                <div>
                  <h2 style={{ textAlign: 'left' }}>{activeUser.firstName} {activeUser.lastName}</h2>
                </div>
              </div>
            ) : ''
            }
            <div className='usrInfoOuter' style={{ marginTop: '0' }}>
              <div className='usrInfoInner' style={{ width: '100%', overflowY: 'scroll', height: '73vh', flexDirection: 'column-reverse', display: 'flex' }} >
                {activeChat && activeUser && myData ? (
                  <div>
                    <div>
                      {activeChat.messages.map((ms) => (
                        <div className='message-container'>
                          {ms.user !== user.id ?
                            <div>
                              <img src={activeUser.pfp} style={{ marginRight: '10px' }} className='msgImage' />
                            </div> : ''
                          }

                          <div className={ms.user === user.id ? 'sent-by-me' : 'sent-by-other'}>
                            <div>
                              <div>
                                <h3>{ms.body}</h3>
                                <p style={{fontSize: '13px'}}>{moment(ms.sent_at).fromNow()}</p>
                              </div>
                            </div>

                          </div>
                          {ms.user === user.id ?
                            <div>
                              <img src={myData.pfp} style={{ marginLeft: '10px' }} className='msgImage' />
                            </div> : ''
                          }
                          <br />
                        </div>
                      ))}
                      <div class="input-container">
                        <input
                          id="input-field"
                          value={newMessage}
                          style={{ width: '100%', opacity: '0.7', height: '60px' }}
                          placeholder={`Message ${activeUser.firstName}`}
                          onChange={(event) => setNewMessage(event.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              sendMessage()
                            }
                          }}
                        />
                        <button className='buttonChange' style={{ background: 'linear-gradient(180deg, #4B91F7 0%, #da42a0 100%)' }} id="send-button" type='submit' onClick={sendMessage}>{'Send'}</button>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div>
                    <h1 style={{ textAlign: 'center' }}>Select a user to chat</h1>
                    <hr />
                    <div>No chat selected</div>
                  </div>
                )}

              </div>
            </div>
          </div>


        </div>

      </div>
    </>
  )
}

export default Messages