import { useState, useEffect, useRef } from 'react'
import dataS from '../services/data'
import blogS from '../services/blog'
import {
  Link, useNavigate
} from 'react-router-dom'
import Net_Home from './components/Net_Home'

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

export default Home