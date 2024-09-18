import { useState, useEffect } from 'react'
import dataS from '../services/data'
import userS from '../services/user'
import chatS from '../services/chat'
import {
  Link,
  useParams, useNavigate,
} from 'react-router-dom'

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

  const [chats, setChats] = useState([])

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

  const checkIfConvoExists = async () => {
    if (usrData && userInf) {
      const chatDataPromises = ogData.chats.map(async (chat) => {
        const chatData = await chatS.getChat(chat)
        return chatData
      })
      const chatDataArray = await Promise.all(chatDataPromises)
      setChats(chatDataArray)

      console.log(ogUser)
      // check if chat already exists or create a new one
      console.log('CHATS', chatDataArray)
      console.log('USRINFO', userInf)
      if (chatDataArray.some(e => e.person1 === userInf.id || e.person2 === userInf.id))
        navigate('/home/messages', { state: { active: userInf.id } })
      else {
        console.log('hdweuiq')
        chatS.postChat({person2: userInf.id}, ogUser.token)
        navigate('/home/messages', { state: { active: userInf.id } })
      }
    }

  }
 
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
              <div style={{marginLeft: '50%', marginRight: '50%'}}>
                <button className='savebtn' onClick={checkIfConvoExists}>Chat</button>
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

export default UserInfo