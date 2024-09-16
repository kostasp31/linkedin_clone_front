import { useState, useEffect } from 'react'
import userS from '../services/user'
import {
  useNavigate
} from 'react-router-dom'

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

export default Net_Home