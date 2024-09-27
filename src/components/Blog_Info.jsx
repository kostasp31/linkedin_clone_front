import { useState, useEffect } from 'react'
import userS from '../services/user'
import blogS from '../services/blog'
import dataS from '../services/data'
import commentS from '../services/comment'
import {
  Link,
  useParams, useNavigate
} from 'react-router-dom'
import moment from 'moment'

const Comment = ({cmt, user, comments, setComments}) => {
  if (!cmt || !user)
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
    const newComments = comments.filter((c) => c.id !== cmt.id)
    setComments(newComments)
  }
  
  if (author && cmt) {
    return (
      <div className='biotext' style={{background:'rgba(231, 215, 193, 0.7)', padding: '10px 10px', margin: '25px 50px', borderRadius:'10px'}}>
        <div>
          <h3>
            By: {author.firstName} {author.lastName}, {moment(cmt.created).fromNow()}
          </h3>
          <p style={{whiteSpace: 'pre-line'}}>{cmt.body}</p>
          <div>
            {user.id === author.id ? <button onClick={delComment} className='cancelbtn' style={{ marginLeft: '1%'}}>Delete</button> : ''}
          </div>
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

  const [userDta, setUserDta] = useState(null)

  const [disableLikes, setDisableLikes] = useState(false)

  const [likes, setLikes] = useState(0)

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
        setLikes(blg.likes)
      }

      const userD = await dataS.userData(user.data.toString())
      setUserDta(userD)

      if (userD && blg && userD.interested.includes(blg.id.toString()))
        setDisableLikes(true)
      else 
        setDisableLikes(false)
        
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
    try {
      const auth = await userS.userInfo(blog.author.toString())
      if (auth)
        await dataS.updateData(auth.userData.toString(), { notifications: `${user.firstName} ${user.lastName} made a comment on your Blog: ${blog.title}` }, user.token)
    }
    catch (error) {
      console.error(error)
    }
    let newCom = comments
    newCom = newCom.concat(resp)
    setComments(newCom)
  }

  const like = async () => {
    if (user && blog && userDta) {
      if (userDta.interested.includes(blog.id.toString())) {
        return
      }
      else {
        blogS.likeBlog(id.toString(), blog.likes + 1, user.token)
        setDisableLikes(true)
        // send a notification to the blog author that you liked their blog
        try {
          const auth = await userS.userInfo(blog.author.toString())
          if (auth)
            await dataS.updateData(auth.userData.toString(), { notifications: `${user.firstName} ${user.lastName} liked your Blog: ${blog.title}` }, user.token)
          setLikes(likes+1)
        }
        catch (error) {
          console.error(error)
        }

      }
    }
  }

  const navigate = useNavigate()
  let boxStyle = {}
  let btnStyle = {}
  {showBox ? boxStyle={ display: '' } : boxStyle={ display: 'none' } }
  {!showBox ? btnStyle={ display: '' } : btnStyle={ display: 'none' } }

  if (blog && userDta && likes !== undefined && comments) {
    return (
      <>
        <header>
          <Link className='button' to='/home' style={{float:'right'}}>Back to Home</Link>
        </header>
        <h1 style={{textAlign:'center', marginTop:'0px',paddingTop:'80px',paddingBottom:'30px'}}>{blog.title}</h1>
        <div className=''>
          <div className='bioText' style={{marginRight: '4%', marginLeft:'4%', width:'auto', paddingBottom:'40px'}} >
            <div style={{ whiteSpace: 'pre-line' }}>{blog.body}</div>
            <div style={{float:'right', display:'flex'}}>
              <h3 style={{margin: '0'}}>Likes: {likes}</h3>
              <button style={{padding: '0px 20px', marginLeft:'10px', height: '30px'}} disabled={disableLikes} className='savebtn' onClick={like}>Like</button>
            </div>
          </div>
        </div>

        <div className='bioText' style={{width:'auto', paddingLeft:'10px', paddingRight:'10px', margin:'30px 4%', paddingBottom: '50px'}}>
          <h2>Comments:</h2>
          {
            blog.comments.length ?
            comments.map((cmt) => {
              if (cmt) {
                return <Comment cmt={cmt} user={user} key={cmt.id} comments={comments} setComments={setComments}/>
              }
            }
            )
              :
              'No comments'
          }
          {
            user ?
              <div style={{ whiteSpace: 'pre-line' }}>
                <div style={{float:'right'}}>
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