import { useState, useEffect } from 'react'
import userS from '../services/user'
import blogS from '../services/blog'
import commentS from '../services/comment'
import {
  Link,
  useParams, useNavigate
} from 'react-router-dom'

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

export default BlogInfo