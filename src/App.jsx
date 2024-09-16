import { useState, useEffect } from 'react'
import loginS from './services/login'
import registerS from './services/register'
import dataS from './services/data'
import userS from './services/user'
import blogS from './services/blog'
import chatS from './services/chat'
import commentS from './services/comment'
import adS from './services/ad'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams, useNavigate,
  Navigate
} from 'react-router-dom'
import data from './services/data'
import Personal from './components/Personal'
import Network from './components/Network'
import Notifications from './components/Notifications'
import Notification from './components/Notification'
import Settings from './components/Settings'
import Login from './components/Login'
import SignUp from './components/SignUp'
import comment from './services/comment'
import blog from './services/blog'
import { js2xml } from 'xml-js'

const About = () => {
  return (
    <div>
      About page
    </div>
  )
}

const Welcome = () => {
  return (
    <div>
      <div className='logoDiv' >
        <a href='/' ><img src='../name.png' className='imageLogo' /></a>
      </div>

      <div className='formGrandpa'>
        <div className='formParent'>

          <div className='forms' style={{width: '600px',  backgroundColor: 'rgba(255,255,255,0.6)'}}>
            <img src='./thunder.png' className='imageLogo'/>
            <h2 className='blk'>Get started with PluggedIn</h2>
            <div style={{marginBottom: '2%'}}>
              <Link to="/login"><button className='savebtn' style={{marginRight: '5px', background:'#22B8D9'}}>Login</button></Link>
              <Link to="/register" ><button className='savebtn'>Join Now</button></Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const Article = () => {
  return (
    <div>

    </div>
  )
}

const Net_Home = ({ pr }) => {
  const navigate = useNavigate()
  const [persn, setPersn] = useState(null)
  useEffect(() => {
    const fun = async () => {
      const person = await userS.userInfo(pr)
      setPersn(person)
    }
    fun()
  }, [])  // user.data ?

  if (persn) {
    return (
      <div>
        <p>{persn.firstName} {persn.lastName}  <button className='buttonChange' style={{ display: 'inline' }} onClick={() => { navigate(`/profile/${pr}`) }}>Visit</button></p>
      </div>
    )
  }
}

const Blog_Home = ({ id, token, upd, setUpd }) => {
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  useEffect(() => {
    const fun = async () => {
      const blg = await blogS.blogInfo(id)
      setBlog(blg)
    }
    fun()
  }, [])  // user.data ?

  if (blog) {
    return (
      <li>
        <h4>{blog.title}, time: {new Date(blog.created).toLocaleDateString()} {new Date(blog.created).toLocaleTimeString()}</h4>
        <p>{blog.body}</p>
        <button className='savebtn' style={{ display: 'inline' }} onClick={() => { navigate(`/blogs/${id}`) }}>Visit</button>
        <button className='cancelbtn' onClick={() => {
          setBlog('')
          blogS.deleteBlog(id, token)
        }
        }>Delete</button>
      </li>
    )
  }
}

const Blog_Home1 = ({ blog}) => {
  const navigate = useNavigate()
  if (blog) {
    return (
      <li>
        <h4>{blog.title}, time: {new Date(blog.created).toLocaleDateString()} {new Date(blog.created).toLocaleTimeString()}</h4>
        <p>{blog.body}</p>
        <button className='savebtn' style={{ display: 'inline' }} onClick={() => { navigate(`/blogs/${blog.id}`) }}>Visit</button>
      </li>
    )
  }
}

const Home = ({ user, setUser }) => {
  const [usrData, setUsrData] = useState(null)
  const [newBlog, setNewBlog] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [netBlogs, setNetBlogs] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    const fun = async () => {
      if (user.email === 'root@tree.org')
        navigate('/admin')

      const data = await dataS.userData(user.data.toString())
      setUsrData(data)

      const blogs = await blogS.getBlogsOfNet(data.id.toString())
      // console.log(blogs)
      setNetBlogs(blogs)
    }
    fun()
  }, [newBlog])  // user.data ?

  if (!user)
    navigate('/')

  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  const uploadBlog = async (event) => {
    const req = {
      likes: 0,
      comments: [],
      author: user.id.toString(),
      body: newBlog,
      title: newTitle
    }
    // console.log(newBlog)
    await blogS.postBlog(req, user.token)
    setNewBlog('')
    setNewTitle('')
  }

  // if (usrData)
  //   console.log('====>', usrData.blogs)

  return (
    <>
      <div style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} >
        <Link className='button' to="/" style={{ backgroundColor: '#48c1df' }} >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal</Link>
        <Link className='button' to="/home/settings">Settings</Link>
        <button className='button' style={{ float: 'right', backgroundColor: '#ff1a1a' }} onClick={logout} >Logout</button>
      </div>
      <div>

        {usrData && user ?
          <div className="container_home">
            <div className="column_left_home">
              <div className='usrInfoOuter' style={{ marginTop: '0' }}>
                <div className='usrInfoInner' style={{ width: '90%' }}>
                  <h2>My Info:</h2>
                  <hr />
                  <p>Name: {user.firstName} {user.lastName}</p>
                  <p>Email: {user.email}</p>
                  <button className='buttonChange' style={{ background: 'linear-gradient(180deg, #4B91F7 0%, #da42a0 100%)' }} onClick={() => {
                    navigate('/home/personal_info')
                  }}>My profile</button>

                  <h2>Network</h2>
                  <hr />
                  {usrData.network.length ?
                    <div>
                      <ul style={{paddingLeft: '0'}}>
                        {usrData.network.map((person) =>
                          <div className='forms' style={{width:'90%', textAlign:''}}>
                            <Net_Home pr={person} key={person} />
                          </div>
                        )}
                      </ul>
                    </div>
                    :
                    <div>
                      No friends :(
                    </div>
                  }

                </div>
              </div>
            </div>

            <div className="column_right_home">
              <div className='usrInfoOuter' style={{ marginTop: '0' }}>
                <div className='usrInfoInner' style={{ width: '95%' }}>
                  <h1 style={{ textAlign: 'center' }}>Post timeline:</h1>
                  <hr />

                    <h2 style={{ textAlign: 'center' }}>My articles:</h2>
                    <hr />
                      {usrData.blogs.length ?
                        <div style={{whiteSpace: 'pre-line'}}>
                          <ul>
                            {usrData.blogs.sort((a, b) => new Date(b.created) - new Date(a.created)).map((blg) =>
                              <ul>  
                                <Blog_Home id={blg} key={blg} token={user.token} />
                              </ul>
                            )}
                          </ul>
                        </div>
                        :
                        <div>
                          No blogs :(
                        </div>
                      }

                  <h2 style={{ textAlign: 'center' }}>Network articles:</h2>
                  <hr />
                  {usrData.network.length ?
                    <div style={{whiteSpace: 'pre-line'}}>
                      <ul>
                        {netBlogs.sort((a, b) => new Date(b.created) - new Date(a.created)).map((blg) =>
                          <ul>  
                            <Blog_Home1 blog={blg} key={blg.id  } />
                          </ul>
                        )}
                      </ul>
                    </div>
                    :
                    <div>
                      No blogs :(
                    </div>
                  }


                  <h2 style={{ textAlign: 'center' }}>Other articles:</h2>
                  <hr />

                  <h2 style={{ textAlign: 'center' }}>Submit new:</h2>
                  <hr />
                  <div>
                    <input style={{width: '100%', opacity: '0.7'}} placeholder='Title' value={newTitle} onChange={(event) => setNewTitle(event.target.value)} />
                    <textarea placeholder='Body' name="Text1" cols="40" rows="5" value={newBlog} onChange={(event) => setNewBlog(event.target.value)} ></textarea>
                    <br />
                    <button type='submit' className='savebtn' onClick={uploadBlog}  >Create Blog</button>
                  </div>

                </div>
              </div>
            </div>


          </div>
          : ''}

      </div>
    </>
  )
}

const Display_Ad = ({id, token}) => {
  const [adInfo, setAdInfo] = useState(null)

  useEffect(() => {
    const fun = async () => {
      const data = await adS.adInfo(id)
      setAdInfo(data)
    }
    fun() 
  }, [])

  const delAd = async () => {
    await adS.deleteAd(id, token)
    setAdInfo(null)
  }

  if (adInfo) {
    return (
    <div style={{width: '100%'}}>
      <h3 style={{ textAlign: 'center' }}>{adInfo.title}</h3>
      <p style={{paddingLeft:'20px'}}>{adInfo.body}</p>  

      <div style={{paddingLeft:'20px'}}>
        <h3>Interest:</h3>
        <button className='cancelbtn' style={{float:'right', marginRight:'20px', marginLeft:'auto'}} onClick={delAd}>Delete</button>
        {
          adInfo.interested.length ?
            adInfo.interested.map((prsn) =>
            <div>
              <Net_Home pr={prsn} key={prsn} />
            </div>)
          :
            <div>
              No interest yet
            </div>
        }
      </div>
      <br />
    </div>
    )
  }
}

const Display_Ad_Net = ({usrid, ad, token, useid}) => {
  const [disableButton, setDisableButton] = useState(false)

  let id
  if (ad.id)
    id = ad.id.toString()
  else if (ad._id)
    id = ad._id.toString()

  const addInterest = async () => {
    await adS.setInterest(id.toString(), 
    {
      "interested": usrid.toString()
    }, token)
    setDisableButton(true)
  }

  if (ad.interested.includes(usrid) && !disableButton)
    setDisableButton(true)

  // console.log(ad)

  return (
  <div className='forms' style={{width: '100%'}}>
    <h3>{ad.title}</h3>
    <p>{ad.body}</p>  
    <button disabled={disableButton} className='savebtn' onClick={addInterest}>Im Interested</button>
  </div>
  )
}

const Ads = ({ user, setUser }) => {
  const [usrData, setUsrData] = useState(null)
  const [netAds, setNetAds] = useState(null)
  const [randAds, setRandAds] = useState(null)
  const [adTitle, setAdTitle] = useState('')
  const [adBody, setAdBody] = useState('')
  const [submit, setSubmit] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const navigate = useNavigate()
  useEffect(() => {
    const fun = async () => {
      const data = await dataS.userData(user.data.toString())
      setUsrData(data)

      const netads = await adS.getAdsOfNet(data.id.toString())
      setNetAds(netads)

      const rands = await adS.getRandomAds("10")
      setRandAds(rands)

      // console.log('HI')
    }
    fun()
  }, [submit])

  if (!user)
    navigate('/')

  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  const createNewAd = async (event) => {
    event.preventDefault()
    await adS.postAd(
      {
        title: adTitle,
        body: adBody,
        author: user.id
      },
    user.token)
    setAdBody('')
    setAdTitle('')
    setSubmit(!submit)
    setCreateOpen(!createOpen)
  }

  let showCreateDiv = {}
  let showCreatebutton = {}
  { createOpen ? showCreateDiv = { display: '' } : showCreateDiv = { display: 'none' } }
  { !createOpen ? showCreatebutton = { display: '' } : showCreatebutton = { display: 'none' } }

  return (
    <>
      <div style={{ backgroundColor: 'black' }} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads" style={{ backgroundColor: '#48c1df' }}>Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal</Link>
        <Link className='button' to="/home/settings">Settings</Link>
        <button className='button' style={{ float: 'right', backgroundColor: '#ff1a1a' }} onClick={logout} >Logout</button>
      </div>

      <div>

        {usrData && user ?
          <div className="container_home">
            <div className="column_left_home" style={{width: '50%'}}>
              <div className='usrInfoOuter' style={{ marginTop: '0' }}>
                <div className='usrInfoInner' style={{ width: '90%' }}>
                  <h1 style={{ textAlign: 'center' }}>My Ads:</h1>
                  <hr />
                  {usrData.ads.length ?
                        <div style={{whiteSpace: 'pre-line'}}>
                          <ul style={{paddingLeft: '0'}}>
                            {usrData.ads.map((ad) =>
                              <div className='forms' style={{width:'auto', textAlign:'left'}}>  
                                <div><Display_Ad id={ad} key={ad} token={user.token}/></div>
                              </div>
                            )}
                          </ul>
                        </div>
                        :
                        <div>
                          No ads yet :(
                        </div>
                      }
                  <hr />

                  <div style={{display:'flex', justifyContent: 'center'}}>
                     <div style={showCreatebutton}>
                        <button style={{float: '0 auto'}} className='savebtn' onClick={() => setCreateOpen(!createOpen)}>Create Ad</button>
                    </div>
                  </div>

                  <div className='creatediv' style={showCreateDiv}>
                    <h2 style={{ textAlign: 'center' }}>Create New</h2>
                    <hr />

                    <div>
                      <input style={{width: '100%', opacity: '0.7'}} placeholder='Title' value={adTitle} onChange={(event) => setAdTitle(event.target.value)} />
                      <textarea placeholder='Body' name="Text2" cols="40" rows="5" value={adBody} onChange={(event) => setAdBody(event.target.value)} ></textarea>
                      <br />
                      <button type='submit' className='savebtn' onClick={createNewAd}>Create Ad</button>
                      <button className='cancelbtn' onClick={() => {setCreateOpen(!createOpen)}}>Cancel</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="column_right_home" style={{width: '50%'}}>
              <div className='usrInfoOuter' style={{ marginTop: '0' }}>
                <div className='usrInfoInner' style={{ width: '95%' }}>
                  <h1 style={{ textAlign: 'center' }}>Ads:</h1>
                  <hr />

                    <h2 style={{ textAlign: 'center' }}>Your Network:</h2>
                    <hr />
                      {
                        netAds ?
                          <div>
                            {netAds.map((ad) =>
                              <ul style={{paddingLeft: '0'}}>  
                                <div><Display_Ad_Net ad={ad} key={Math.floor(Math.random() * 10)} usrid={user.id} token={user.token} useid={true}/></div>
                              </ul>
                            )}
                          </div>
                        
                        :
                          <div>
                            No ads yet
                          </div>
                      }
                    <hr />

                  <h2 style={{ textAlign: 'center' }}>You may also be interested:</h2>
                  <hr />
                      {
                        randAds && netAds ?
                          <div>
                            {randAds.filter((ad0) => {
                              if (ad0.author === user.id.toString() || netAds.some(n => n.author === ad0.author))
                                return false
                              else
                                return true
                            }).map((ad) =>
                              <ul style={{paddingLeft: '0'}}>  
                                <div><Display_Ad_Net ad={ad} key={Math.floor(Math.random() * 10)} usrid={user.id} token={user.token} useid={false}/></div>
                              </ul>
                            )}
                          </div>
                        
                        :
                          <div>
                            No ads yet
                          </div>
                      }
                </div>
              </div>
            </div>


          </div>
          : ''}

      </div>
    </>
  )
}

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
  useEffect(() => {
    const fun = async () => {
      const data = await dataS.userData(user.data.toString())
      setUsrData(data)


      const chatDataPromises = data.chats.map(async (chat) => {
        const chatData = await chatS.getChat(chat)
        return chatData
      })
      const chatDataArray = await Promise.all(chatDataPromises)
      setChats(chatDataArray)
      
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
    fun()
  }, [activeChat])


  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  const usrClick = (ch) => {
    const selectedChat = allChats.find(obj => obj.person1 === ch.id || obj.person2 === ch.id )
    setActiveChat(selectedChat)
    console.log('selchat', selectedChat)
    console.log('all', allChatsInfo)

    const selectedUsr = allChatsInfo.find(obj => obj.id === selectedChat.person1 || obj.id === selectedChat.person2 )
    setActiveUser(selectedUsr)
    console.log('selusr', selectedUsr)
  }

  const sendMessage = () => {
    if (/^\s*$/.test(newMessage)){
      setNewMessage('')
      return
    }
    chatS.updateChat(activeChat.id, { body: newMessage }, user.token)
    setUpd(!upd)
    
    let msgs = activeChat.messages
    msgs = msgs.concat({body: newMessage, user: user.id})
    console.log(msgs)

    let newActive = activeChat
    newActive.messages = msgs
    setActiveChat(newActive)
    console.log(newActive)

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
            <div className="column_left_home" style={{width: '20%'}}>
              <div className='usrInfoOuter' style={{ marginTop: '0' }}>
                <div className='usrInfoInner' style={{ width: '95%', overflowY: 'scroll', height: '80vh'}}>
                  <h1 style={{ textAlign: 'center' }}>Contacts:</h1>
                  <hr />

                  {allChats.length ?
                    allChatsInfo.map((ch) =>
                      <div onClick={() => usrClick(ch)}>
                        {ch.firstName} {ch.lastName}
                      </div>
                    )
                  : 'Loading'}

                </div>
              </div>
            </div>

            <div className="column_right_home" style={{width: '100%'}}>
              <div className='usrInfoOuter' style={{ marginTop: '0' }}>
                <div className='usrInfoInner' style={{ width: '100%' , overflowY: 'scroll', height: '80vh', flexDirection: 'column-reverse', display:'flex'}}>
                  {activeChat && activeUser && myData ? (
                    <div>
                      <h2 style={{ textAlign: 'left', position:'sticky' }}>{activeUser.firstName} {activeUser.lastName}</h2>
                      <hr />
                      {activeChat.messages.map((ms) => (
                        <div className='message-container'>
                            {ms.user !== user.id ? 
                              <div>
                                <img src={activeUser.pfp} style={{marginRight: '10px'}} className='msgImage'/>
                              </div> : ''
                            }
                                
                          <div className={ms.user === user.id ? 'sent-by-me' : 'sent-by-other'}> 
                              <div>
                                <div>
                                  <h3>{ms.body}</h3>
                                </div>
                              </div>

                          </div>
                          {ms.user === user.id ? 
                            <div>
                              <img src={myData.pfp} style={{marginLeft: '10px'}} className='msgImage'/>
                            </div> : ''
                          }
                          <br />
                        </div>
                      ))}
                      <div>
                        <input 
                          value={newMessage} 
                          style={{width: '100%', opacity: '0.7', height:'60px' }}
                          placeholder={`Message ${activeUser.firstName}`}
                          onChange={(event) => setNewMessage(event.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              sendMessage()
                            }
                          }}
                          />
                        <button type='submit' onClick={sendMessage}>Send</button>
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

const Footer = () => {
  return (
    <div className='footer'>
      <p>Kostas Petrakis & Filippos Papadimitriou, copyright 2024. All rights reserved &copy;</p>
    </div>
  )
}

const UserInfo = ({ogUser, ogData}) => {
  const [usrData, setUsrData] = useState(null)
  const [userInf, setUserInf] = useState(null)
  const [cv, setCv] = useState('')
  const [hobbies, setHobbies] = useState('')
  const [exp, setExp] = useState('')
  const [gender, setGender] = useState('')

  const [address, setAddress] = useState(null)
  const [addressP, setAddressP] = useState(null)
  const [showAddress, setShowAddress] = useState(null)

  const [number, setNumber] = useState(null)
  const [image, setImage] = useState('')
  const [pre, setPre] = useState('Your')

  const id = useParams().id

  useEffect(() => {
    const fun = async () => {
      const userInformation = await userS.userInfo(id.toString())
      const data = await dataS.userData(userInformation.userData.toString())

      setUsrData(data)
      setUserInf(userInformation)

      setCv(data.bio)
      setHobbies(data.hobbies)
      setExp(data.experience)
      if (data.gender === 1)
        setGender('Male')
      else if (data.gender === 2)
        setGender('Female')
      setAddress(data.address)
      setAddressP(data.public.addressP)
      setNumber(userInformation.phoneNumber)
      setImage(userInformation.pfp)
      setPre(`${userInformation.firstName} ${userInformation.lastName}'s`)

      // console.log(data.network.includes(id))
      if (ogUser.id === id || data.network.includes(ogUser.id))
        setShowAddress(true)
      else
        setShowAddress(false)
    }
    fun()
  }, [])  // user.data ?

  // if (!userInf)
  //   navigate('/')

  const navigate = useNavigate()

  return (
    <>
      <header>
        <Link className='button' to='/home' style={{float:'right'}}>Back to Home</Link>
      </header>
      <div>
        {(usrData && userInf) ?
          <div className='usrInfoOuter'>
            <div className='usrInfoInner'>
              <div style={{ marginLeft: '8%' }}>
                <h2 style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>{pre} info:</h2>
                <h3>Name: {userInf.firstName} {userInf.lastName}</h3><img className='fpfPicture' src={image} />
                <h3>Email: {userInf.email}</h3>
                <h3>Phone number: {userInf.phoneNumber ? <div>{number}</div> : 'Not specified '}</h3>
                <h3>Address: {address && showAddress? <div>{address} </div> : 'Not specified or privated info'}</h3>
                <h3>Gender: {gender ? `${gender} ` : 'Not specified '}</h3>
              </div>
            </div>
          </div>
          : ''}

        <div style={{width: '90%', margin: '0 auto'}}>
        <h2>{pre} CV:</h2>
        <div className=''>
          <div className='bioText' >
            {usrData ?
              <div style={{ whiteSpace: 'pre-line' }}>{cv}</div>
              : ''
            }
          </div>
        </div>

        <h2>{pre} Experience:</h2>
        <div className='bioText' >
          {usrData ?
            <div style={{ whiteSpace: 'pre-line' }}>{exp}</div>
            : ''
          }
        </div>

        <h2>{pre} Hobbies:</h2>
        <div className='bioText' >
          {usrData ?
            <div style={{ whiteSpace: 'pre-line' }}>{hobbies}</div>
            : ''
          }
        </div>
        </div>

      </div>
    </>
  )
}

const Comment = ({cmt, user}) => {
  if (!cmt || ! user)
    return (<></>)
  const [author, setAuthor] = useState(null)
  useEffect(() => {
    const fun = async () => {
      const auth = await userS.userInfo(cmt.author)
      setAuthor(auth)
    }
    fun()
  }, []) 

  const delComment = async () => {
    const resp = await commentS.deleteComm(cmt.id, user.token)
    // console.log(resp)
    setAuthor('')
  }
  
  
  if (author && cmt) {
    return (
      <div className='biotext' style={{background:'rgba(231, 215, 193, 0.7)'}}>
        <div>
          <h3>
            By: {author.firstName} {author.lastName}, time: {new Date(cmt.created).toLocaleDateString()} {new Date(cmt.created).toLocaleTimeString()}
          </h3>
          <p style={{whiteSpace: 'pre-line'}}>{cmt.body}</p>
          <div>
            {user.id === author.id ? <button onClick={delComment} className='cancelbtn' style={{ marginLeft: '1%'}}>Delete</button> : ''}
          </div>
          <hr />
        </div>
      </div>
    )
  }
}

const BlogInfo = ({user}) => {
  const [blog, setBlog] = useState(null)
  const [comments, setComments] = useState([])

  const [newComment, setNewComment] = useState('')
  const [showBox, setShowBox] = useState(false)

  const [upd, setUpd] = useState(false)

  const id = useParams().id

  useEffect(() => {
    const fun = async () => {
      const blg = await blogS.blogInfo(id.toString())
      setBlog(blg)

      if (blg) {
        let commentsArray = []
        let com
        for (var i = 0; i < blg.comments.length; i++) {
          com = await commentS.getComment(blg.comments[i])
          commentsArray.push(com)
        }
        setComments(commentsArray)
      }
      // commentsArray.sort((a, b) => new Date(b.created) - new Date(a.created))
      // setComments([])
      // setComments(prevComments => [...prevComments, ...commentsArray])
    }
    fun()
  }, [upd])

  // if (!userInf)
  //   navigate('/')
  const postComment = async () => {
    const resp = await commentS.postComm({
      body: newComment,
      author: user.id,
      blog: blog.id
    }, user.token)
    console.log(resp)
    setNewComment('')
    setUpd(!upd)
    setShowBox(false)
  }

  const navigate = useNavigate()
  let boxStyle = {}
  let btnStyle = {}
  {showBox ? boxStyle={ display: '' } : boxStyle={ display: 'none' } }
  {!showBox ? btnStyle={ display: '' } : btnStyle={ display: 'none' } }

  if (blog) {
    return (
      <>
        <header>
          <Link className='button' to='/home' style={{float:'right'}}>Back to Home</Link>
        </header>
        <h1 style={{textAlign:'center', marginTop:'0px',paddingTop:'80px',paddingBottom:'30px'}}>{blog.title}</h1>
        <div className=''>
          <div className='bioText' style={{marginRight: '4%', marginLeft:'4%', width:'auto'}} >
            <div style={{ whiteSpace: 'pre-line' }}>{blog.body}</div>
          </div>
        </div>

        <div style={{marginRight: '4%', marginLeft:'4%', width:'auto'}}>
          <h2>Comments:</h2>
          {
            blog.comments.length ?
            comments.map((cmt) =>
              <Comment cmt={cmt} user={user}/>
            )
              :
              'No comments'
          }
          {
            user ?
              <div style={{ whiteSpace: 'pre-line' }}>
                <div>
                  <button  className='savebtn' style={btnStyle} onClick={() => setShowBox(!showBox)}>Comment</button>
                </div>
                <div style={boxStyle}>
                  <textarea name="Text2" cols="40" rows="5" value={newComment} onChange={(event) => setNewComment(event.target.value)}></textarea>
                  <button onClick={postComment} className='savebtn' >Post comment</button><button onClick={() => {
                    setShowBox(false)
                    setNewComment('')
                  }} className='cancelbtn' >Cancel</button>
                </div>
              </div>
            : 'You must log in to comment'
          }
        </div>
      </>
    )
  }
}

const Admin_Page = ({user, setuser}) => {
  const navigate = useNavigate()
  const [allData, setAllData] = useState(null)
  const [upd, setUpd] = useState(false)
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')

  // redirect to home if you are not the
  // root or not logged in ofc
  useEffect(() => {
    const fun = async () => {
      if (!user) {
        const loggedInUser = window.localStorage.getItem('loggedInUser')
        if (loggedInUser)
          setuser(loggedInUser)
        else
          navigate('/login')
      }

      if (user) {
        if (user.email != 'root@tree.org')
          navigate('/home')
        const dt = await userS.getAllUserData(user.token)
        setAllData(dt)
        setUpd(!upd)
      }
    }
    fun()
  }, [user])

  const downloadJson_single = (id) => {
    const filteredData = allData.find((item) => item.id === id)
    const jsonData = JSON.stringify(filteredData)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `data-${filteredData.firstName}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadXML_single = (id) => {
    const filteredData = allData.find((item) => item.id === id)
    const xml = js2xml({root: filteredData}, 
      {
        compact: true,
        ignoreComment: true,
        spaces: 4
      }
    )
    const blob = new Blob([xml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `data-${filteredData.firstName}.xml`
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadXML_selected = () => {
    const filteredData = allData.filter((item) => selected.includes(item))
    const nn = { root: filteredData.map((dt) => ({ element: dt })) }   

    // console.log({root: nn})
    const xml = js2xml({ root: nn }, 
      {
        compact: true,
        ignoreComment: true,
        spaces: 4
      }
    )
    const blob = new Blob([xml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users_data.xml'
    a.click()
  }
  
  const downloadJson_selected = async () => {
    const filteredData = allData.filter((item) => selected.includes(item))
    const blob = new Blob([JSON.stringify(filteredData)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users_data.json'
    a.click()
  }
  
  const downloadJson_all = async () => {
    const blob = new Blob([JSON.stringify(allData)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users_data.json'
    a.click()
  }

  const downloadXML_all = async () => {
    const nn = { root: allData.map((dt) => ({ element: dt })) }   
    // console.log({root: nn})
    const xml = js2xml({ root: nn }, 
      {
        compact: true,
        ignoreComment: true,
        spaces: 4
      }
    )
    const blob = new Blob([xml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users_data.xml'
    a.click()
  }

  const logout = () => {
    setuser(null)
    window.localStorage.clear()
    navigate('/')
  }

  return (
    <div>
      <div>
        <h1 style={{  width:'100%', textAlign:'center', justifyContent: 'center'}}>ADMIN PAGE <button className='savebtn' style={{ float:'right', backgroundColor: '#ff1a1a'}} onClick={logout} >Logout</button></h1>
      </div>
      <hr />
      <br />
      <div style={{  width:'100%', display: 'flex', justifyContent: 'center'}}>
        <button onClick={downloadJson_selected} className='savebtn' style={{background:'#662377'}}>Download selected JSON</button>
        <button onClick={downloadXML_selected} className='savebtn' style={{background:'#a82973'}}>Download selected XML</button>
        <button onClick={downloadJson_all} className='savebtn1' style={{background:'#ef5064'}}>Download All JSON</button>
        <button onClick={downloadXML_all} className='savebtn1' style={{background:'#fc867d'}}>Download All XML</button>
      </div>
      <br />
      <div className='forms'>
        <div style={{  width:'100%', display: 'flex', justifyContent: 'center'}}>
          <h3>Search By Email </h3><br />
        </div>
        <div style={{  width:'100%', display: 'flex', justifyContent: 'center'}}>
          <input type='text' value={search} onChange={(event) => setSearch(event.target.value)}/>
        </div>
      </div>
      <br />
      {allData ? allData.map((data) =>
        {if (data.email.includes(search)) {
          return (
          <div className='forms' style={{width: '45%', position:'relative'}}>
            <h2>{data.email}</h2>
            <button onClick={() => downloadJson_single(data.id)} className='savebtn' style={{display:'inline-block', marginRight:'5px'}}>Download Json</button>
            <button onClick={() => downloadXML_single(data.id)} className='savebtn1' style={{display:'inline-block'}}>Download XML</button>
            <div className='checkbox-container'>
            <input
              type="checkbox"
              checked={selected.includes(data)}
              onChange={(e) => {
                if (e.target.checked)
                  setSelected([...selected, data])
                else
                  setSelected(selected.filter((u) => u.id !== data.id))
              }}

              />
            </div>
            <br />
          </div>
      )}}
      ) : ''}
      <br />

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
    }
    const fun = async () => {
      const data = await dataS.userData(user.data.toString())
      setUserData(data)
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
        <Route path="/blogs/:id" element={<BlogInfo user={user}/>} />
        <Route path="/admin" element={<Admin_Page user={user} setuser={setUser}/>} />
      </Routes>
      {/* <Footer /> */}
    </div>
  )
}

export default App
