import { useState, useEffect, useRef } from 'react'
import dataS from '../services/data'
import blogS from '../services/blog'
import userS from '../services/user'
import {
  Link, useNavigate
} from 'react-router-dom'
import Net_Home from './Net_Home'
import isAuthenticated from '../services/authCheck'
import axios from 'axios'
import moment from 'moment'

const Blog_Home = ({ id, token, upd, setUpd }) => {
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [auth, setAuth] = useState(null)
  useEffect(() => {
    const fun = async () => {
      try {
        const blg = await blogS.blogInfo(id)
        setBlog(blg)
      }
      catch (exception) {
        console.log(exception)
      }

      if (blog) {
        const author = await userS.userInfo(blog.author)
        setAuth(author)
      }
    }
    fun()
  }, [])  // user.data ?

  useEffect(() => {
    const fun = async () => {
      if (blog) {
        const author = await userS.userInfo(blog.author)
        setAuth(author)
      }
    }
    fun()
  }, [blog])
  
  if (blog && auth) {
    return (
      <div key={blog.id.toString()}>
        <h3>{blog.title}, posted: {moment(blog.created).fromNow()}</h3>
        <h4>Author: {auth.firstName} {auth.lastName}</h4>
        {/* <p>{blog.body}</p> */}
        <button className='savebtn' style={{ display: 'inline' }} onClick={() => { navigate(`/blogs/${id}`) }}>Visit</button>
        <button className='cancelbtn' onClick={() => {
          setBlog('')
          blogS.deleteBlog(id, token)
        }
      }>Delete</button>
      </div>
    )
  }
}

const Blog_Home1 = ({ blog }) => {
  const [auth, setAuth] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    const fun = async () => {
      if (blog) {
        const author = await userS.userInfo(blog.author)
        setAuth(author)
      }
    }
    fun()
  }, [])

  if (blog && auth) {
    return (
      <div key={blog.id.toString()}>
        <h3>{blog.title}, posted: {moment(blog.created).fromNow()}</h3>
        <h4>Author: {auth.firstName} {auth.lastName}</h4>
        {/* <p>{blog.body}</p> */}
        <button className='savebtn' style={{ display: 'inline' }} onClick={() => { navigate(`/blogs/${blog.id}`) }}>Visit</button>
      </div>
    )
  }
}

const Home = ({ user, setUser }) => {
  const [usrData, setUsrData] = useState(null)
  const [newBlog, setNewBlog] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [netBlogs, setNetBlogs] = useState([])
  const [randBlogs, setRandBlogs] = useState(null)
  const [popupStyle, setPopupStyle] = useState({display: 'none'})
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [mediaType, setMediaType] = useState(null)
  const navigate = useNavigate()
  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  useEffect(() => {
    const fun = async () => {

      if (user.email === 'root@tree.org')
        navigate('/admin')

      const data = await dataS.userData(user.data.toString())
      setUsrData(data)

      const blogs = await blogS.getBlogsOfNet(data.id.toString())
      // console.log(blogs)
      setNetBlogs(blogs)

      const rands = await blogS.getRandomBlogs("10", user.token)
      setRandBlogs(rands)
    }
    fun()
  }, [newBlog])  // user.data ?

  if (!user)
    navigate('/')


  const uploadBlog = async (event) => {
    const req = {
      likes: 0,
      comments: [],
      author: user.id.toString(),
      body: newBlog,
      title: newTitle
    }
    if (!newBlog || !newTitle)
      return
    // console.log(newBlog)
    await blogS.postBlog(req, user.token)
    setNewBlog('')
    setNewTitle('')
  }

  // if (usrData)
  //   console.log('====>', usrData.blogs)
  const fileSelect = (event) => {
    const fileName = event.target.files[0].name
    let extension3 = fileName.slice(-3)
    let extension4 = fileName.slice(-4)
    if (extension3 === 'jpg' || extension3 === 'png' || extension3 === 'gif' || extension4 === 'jpeg') {
      setSelectedMedia(event.target.files[0])
      setMediaType('img')
    }
    else if(extension3 === 'mp4' || extension4 === 'webm') { 
      setSelectedMedia(event.target.files[0])
      setMediaType('vid')
    }
    else if(extension3 === 'mp3' || extension3 === 'wav' || extension3 === 'ogg') { 
      setSelectedMedia(event.target.files[0])
      setMediaType('aud')
    }
    else
      alert('Unsupported format')
  }

  const uploadMedia = async(event) => {
    event.preventDefault()

    if (selectedMedia === null) {
      alert('Please choose some media first')
      return
    }
    const resp = await userS.submitMedia(selectedMedia, user.token)
    setPopupStyle({display: 'none'})

    let blogWithMedia = newBlog

    if (mediaType === 'img') {
      blogWithMedia = blogWithMedia.concat(`\n\n@!img<${resp.path}>\n\n`)
      console.log(blogWithMedia)
    }
    else if (mediaType === 'vid') {
      blogWithMedia = blogWithMedia.concat(`\n\n@!vid<${resp.path}>\n\n`)
      console.log(blogWithMedia)
    }
    else if (mediaType === 'aud') {
      blogWithMedia = blogWithMedia.concat(`\n\n@!aud<${resp.path}>\n\n`)
      console.log(blogWithMedia)
    }

    setNewBlog(blogWithMedia)
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
      {/* <div>
      <form>
        <input type="file" id="myFile" name="filename" />
        <button onClick={async(event) => {
          event.preventDefault()
        }} type="submit">Submit image</button>
      </form>
      </div> */}
      <div className="modal" style={popupStyle}>
        <div className="modal-content">
          <span style={{float : 'right', fontWeight: 'bold', fontSize: '30px', cursor: 'pointer'}} onClick={() => {setPopupStyle({display: 'none'})}}>&times;</span>
          <form onSubmit={uploadMedia}>
            <input type="file" onChange={fileSelect} />
            <input className='buttonChange' type="submit" value="Upload File" style={{  display: 'flex', flexDirection: 'column'}} />
            <p>
              Supported formats:<br />
              Images: .jpg, .png, .gif <br />
              Videos: .mp4, .webm<br />
              Audio: .mp3, .wav, .ogg <br />
            </p> 
          </form>
        </div>
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
                      <div style={{paddingLeft: '0'}}>
                        {usrData.network.map((person) =>
                          <div className='forms' style={{width:'90%', textAlign:''}} key={person.toString()}>
                            <Net_Home pr={person} key={person.toString()} />
                          </div>
                        )}
                      </div>
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
                            {usrData.blogs.sort((a, b) => new Date(b.created) - new Date(a.created)).map((blg) =>
                              <div key={blg.toString()}>  
                                <Blog_Home id={blg} key={blg.toString()} token={user.token} />
                              </div>
                            )}
                        </div>
                        :
                        <div>
                          No blogs :(
                        </div>
                      }

                  <h2 style={{ textAlign: 'center' }}>Network articles:</h2>
                  <hr />
                  {netBlogs.length ?
                    <div style={{whiteSpace: 'pre-line'}}>
                      <div>
                        {netBlogs.sort((a, b) => new Date(b.created) - new Date(a.created)).map((blg) =>
                          <div key={blg.id.toString()}>  
                            <Blog_Home1 blog={blg} key={blg.id.toString()  } />
                          </div>
                        )}
                      </div>
                    </div>
                    :
                    <div>
                      No blogs :(
                    </div>
                  }


                  <h2 style={{ textAlign: 'center' }}>Other articles:</h2>
                  <hr />
                    {
                      randBlogs && randBlogs.length ?//&& netAds ?
                        <div>
                          {randBlogs.filter((blg0) => {
                            // if (ad0.author === user.id.toString() || netAds.some(n => n.author === ad0.author))
                            if (!blg0)
                              return
                            if (blg0.author === user.id.toString())
                              return false
                            else
                              return true
                          }).map((blg, index) =>
                            <div key={index}>  
                              <Blog_Home1 blog={blg} key={blg.id.toString()  } />
                            </div>
                          )}
                        </div>
                      
                      :
                        <div>
                          No more Blogs
                        </div>
                    }
                  <h2 style={{ textAlign: 'center' }}>Submit new:</h2>
                  <hr />
                  <div>
                    <input style={{width: '100%', opacity: '0.7'}} placeholder='Title' value={newTitle} onChange={(event) => setNewTitle(event.target.value)} />
                    <textarea placeholder='Body' name="Text1" cols="40" rows="5" value={newBlog} onChange={(event) => setNewBlog(event.target.value)} ></textarea>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button type='submit' className='savebtn' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={uploadBlog}>
                        Create Blog <img style={{ marginLeft: '10px' }} src={"/create_icon.png"} />
                      </button>
                      <button className='savebtn' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setPopupStyle({ display: 'block' })}>
                        Add Media<img style={{ marginLeft: '10px' }} src={"/upload_icon.png"} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
          : <div className='loading_image'><img src='/loading_256.gif' /></div>}

      </div>
    </>
  )
}

export default Home