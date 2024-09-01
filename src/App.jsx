import { useState, useEffect } from 'react'
import loginS from './services/login'
import registerS from './services/register'
import dataS from './services/data'
import userS from './services/user'
import blogS from './services/blog'
import commentS from './services/comment'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams, useNavigate,
  Navigate
} from 'react-router-dom'
import data from './services/data'
import Personal from './components/Personal'
import Notification from './components/Notification'
import Settings from './components/Settings'
import Login from './components/Login'
import SignUp from './components/SignUp'
import comment from './services/comment'

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
      <div style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} >
        <Link className='button' to="/login" style={{ float: 'right' }} >Login</Link>
        <Link className='button' to="/register" style={{ float: 'right' }}>Join Now</Link>
        <Link className='button' to="/about">about</Link>
      </div>
      {/* <img src='../name.png' /> */}
    </>
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
      <li>
        <p>{persn.firstName} {persn.lastName}  <button className='buttonChange' style={{ display: 'inline' }} onClick={() => { navigate(`/profile/${pr}`) }}>Visit</button></p>
      </li>
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
        <h4>{blog.title}</h4>
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

const Home = ({ user, setUser }) => {
  const [usrData, setUsrData] = useState(null)
  const [newBlog, setNewBlog] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    const fun = async () => {
      const data = await dataS.userData(user.data.toString())
      setUsrData(data)
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
      title: "Example title"
    }
    console.log(newBlog)
    await blogS.postBlog(req, user.token)
    setNewBlog('')
  }

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
                      <ul>
                        {usrData.network.map((person) =>
                          <ul>
                            <Net_Home pr={person} key={person} />
                          </ul>
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
                    <div>
                      <ul>
                        {usrData.blogs.map((blg) =>
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

                  <h2 style={{ textAlign: 'center' }}>Other articles:</h2>
                  <hr />

                  <h2 style={{ textAlign: 'center' }}>Submit new:</h2>
                  <hr />
                  <div>
                    <textarea name="Text1" cols="40" rows="5" value={newBlog} onChange={(event) => setNewBlog(event.target.value)} ></textarea>
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

const Network = ({ user, setUser }) => {
  const navigate = useNavigate()
  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  return (
    <>
      <div style={{ backgroundColor: 'black' }} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network" style={{ backgroundColor: '#48c1df' }}>Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal</Link>
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
      <div style={{ backgroundColor: 'black' }} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications" style={{ backgroundColor: '#48c1df' }}>Notifications</Link>
        <Link className='button' to="/home/personal_info">Personal</Link>
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

const Footer = () => {
  return (
    <div className='footer'>
      <p>Kostas Petrakis & Filippos Papadimitriou, copyright 2024. All rights reserved &copy;</p>
    </div>
  )
}

const UserInfo = () => {
  const [usrData, setUsrData] = useState(null)
  const [userInf, setUserInf] = useState(null)
  const [cv, setCv] = useState('')
  const [hobbies, setHobbies] = useState('')
  const [exp, setExp] = useState('')
  const [gender, setGender] = useState('')
  const [address, setAddress] = useState(null)
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
      setNumber(userInformation.phoneNumber)
      setImage(userInformation.pfp)
      setPre(`${userInformation.firstName} ${userInformation.lastName}'s`)
    }
    fun()
  }, [])  // user.data ?

  // if (!userInf)
  //   navigate('/')

  const navigate = useNavigate()

  return (
    <>
      <div>
        {(usrData && userInf) ?
          <div className='usrInfoOuter'>
            <div className='usrInfoInner'>
              <div style={{ marginLeft: '8%' }}>
                <h2 style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>{pre} info:</h2>
                <h3>Name: {userInf.firstName} {userInf.lastName}</h3><img className='fpfPicture' src={image} />
                <h3>Email: {userInf.email}</h3>
                <h3>Phone number: {userInf.phoneNumber ? <div>{number}</div> : 'Not specified '}</h3>
                <h3>Address: {address ? <div>{address} </div> : 'Not specified '}</h3>
                <h3>Gender: {gender ? `${gender} ` : 'Not specified '}</h3>
              </div>
            </div>
          </div>
          : ''}
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
    </>
  )
}

const Comment = ({cmt, user}) => {
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
    console.log(resp)
    setAuthor('')
  }
  
  
  if (author) {
    return (
      <div>
      <h3>
        By: {author.firstName} {author.lastName}, time: {new Date(cmt.created).toLocaleDateString()} {new Date(cmt.created).toLocaleTimeString()}
      </h3>
        <p>{cmt.body}</p>
        <div>
          {user.id === author.id ? <button onClick={delComment} className='cancelbtn' style={{ marginLeft: '1%'}}>Delete</button> : ''}
        </div>
        <hr />
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

      let commentsArray = []
      let com
      for (var i = 0; i < blg.comments.length; i++) {
        com = await commentS.getComment(blg.comments[i])
        commentsArray.push(com)
      }
      commentsArray.sort((a, b) => new Date(b.created) - new Date(a.created))
      setComments([])
      setComments(prevComments => [...prevComments, ...commentsArray])
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
        <h2>{blog.title}</h2>
        <div className=''>
          <div className='bioText' >
            <div style={{ whiteSpace: 'pre-line' }}>{blog.body}</div>
          </div>
        </div>
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
      </>
    )
  }
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorMessage1, setErrorMessage1] = useState(null)
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
        <Route path="/home/settings" element={user ? <Settings user={user} setUser={setUser} msg={errorMessage} setMsg={setErrorMessage} msg1={errorMessage1} setMsg1={setErrorMessage1} /> : <Navigate replace to="/login" />} />
        <Route path="/profile/:id" element={<UserInfo />} />
        <Route path="/blogs/:id" element={<BlogInfo user={user}/>} />
      </Routes>
      {/* <Footer /> */}
    </div>
  )
}

export default App
