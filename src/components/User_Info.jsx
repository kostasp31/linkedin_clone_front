import { useState, useEffect } from 'react'
import dataS from '../services/data'
import userS from '../services/user'
import {
  Link,
  useParams, useNavigate,
} from 'react-router-dom'

const UserInfo = ({ogUser, ogData}) => {
  const [usrData, setUsrData] = useState(null)
  const [userInf, setUserInf] = useState(null)

  const [cv, setCv] = useState('')
  const [showCv, setShowCv] = useState('')

  const [hobbies, setHobbies] = useState('')
  const [showHobbies, setShowHobbies] = useState('')

  const [exp, setExp] = useState('')
  const [showExp, setShowExp] = useState('')

  const [gender, setGender] = useState('')

  const [worksIn, setWorksIn] = useState('')
  const [showWorksIn, setShowWorksIn] = useState('')

  const [pos, setPos] = useState('')
  const [showPos, setShowPos] = useState('')

  const [address, setAddress] = useState('')
  const [showAddress, setShowAddress] = useState('')

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
      setPos(data.position)
      setWorksIn(data.works)


      if (data.network.includes(ogUser.id) || data.public.addressP)
        setShowAddress(true)
      else
        setShowAddress(false)

      if (data.network.includes(ogUser.id) || data.public.bioP)
        setShowCv(true)
      else
        setShowCv(false)

      if (data.network.includes(ogUser.id) || data.public.experienceP)
        setShowExp(true)
      else
        setShowExp(false)

      if (data.network.includes(ogUser.id) || data.public.hobbiesP)
        setShowHobbies(true)
      else
        setShowHobbies(false)

      if (data.network.includes(ogUser.id) || data.public.worksP)
        setShowWorksIn(true)
      else
        setShowWorksIn(false)

      if (data.network.includes(ogUser.id) || data.public.posP)
        setShowPos(true)
      else
        setShowPos(false)
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
                <h3>Works in: {worksIn && showWorksIn? <div>{worksIn}</div>: 'Not specified or privated info'}</h3>
                <h3>Position: {pos && showPos? <div>{pos}</div>: 'Not specified or privated info'}</h3>
              </div>
            </div>
          </div>
          : ''}

        <div style={{width: '90%', margin: '0 auto'}}>
        <h2>{pre} CV:</h2>
        <div className=''>
          <div className='bioText' >
            {usrData ?
              <div style={{ whiteSpace: 'pre-line' }}>{cv && showCv ? <div>{cv} </div> : 'Not specified or privated info'}</div>
              : ''
            }
          </div>
        </div>

        <h2>{pre} Experience:</h2>
        <div className='bioText' >
          {usrData ?
            <div style={{ whiteSpace: 'pre-line' }}>{exp && showExp ? <div>{exp} </div> : 'Not specified or privated info'}</div>
            : ''
          }
        </div>

        <h2>{pre} Hobbies:</h2>
        <div className='bioText' >
          {usrData ?
            <div style={{ whiteSpace: 'pre-line' }}>{hobbies && showHobbies? <div>{hobbies} </div> : 'Not specified or privated info'}</div>
            : ''
          }
        </div>
        </div>

      </div>
    </>
  )
}

export default UserInfo