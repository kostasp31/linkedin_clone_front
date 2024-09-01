import { useState, useEffect } from 'react'
import loginS from '../services/login'
import registerS from '../services/register'
import dataS from '../services/data'
import userS from '../services/user'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams, useNavigate,
  Navigate
} from 'react-router-dom'
import data from '../services/data'

const Personal = ({ user, setUser }) => {
  const [usrData, setUsrData] = useState(null)
  const [userInf, setUserInf] = useState(null)
  
  const [cv, setCv] = useState('')
  const [editedCv, setEditedCv] = useState('')
  const [edit, setEdit] = useState(false)
  const [editText, setEditText] = useState('Edit')

  const [hobbies, setHobbies] = useState('')
  const [editedHobbies, setEditedHobbies] = useState('')
  const [editHobbies, setEditHobbies] = useState(false)
  const [editTextHobbies, setEditTextHobbies] = useState('Edit')

  const [exp, setExp] = useState('')
  const [editedExp, setEditedExp] = useState('')
  const [editExp, setEditExp] = useState(false)
  const [editTextExp, setEditTextExp] = useState('Edit')

  const [editGender, setEditGender] = useState(false)
  const [selectedGender, setSelectedGender] = useState('')
  const [gender, setGender] = useState('')

  const [address, setAddress] = useState(null)
  const [editAddress, setEditAddress] = useState(false)
  const [newAddress, setNewAddress] = useState('')

  const [number, setNumber] = useState(null)
  const [editNumber, setEditNumber] = useState(false)
  const [newNumber, setNewNumber] = useState('')
  
  const [image, setImage] = useState('')

  useEffect(() => {
    const fun = async () => {
      const data = await dataS.userData(user.data.toString())
      setUsrData(data)

      setCv(data.bio)
      setEditedCv(data.bio)

      setExp(data.experience)
      setEditedExp(data.experience)

      setHobbies(data.hobbies)
      setEditedHobbies(data.hobbies)

      if (data.gender === 1)
        setGender('Male')
      else if (data.gender === 2)
        setGender('Female')

      setAddress(data.address)
  
      const userInformation = await userS.userInfo(user.id.toString())
      setUserInf(userInformation)
      
      setNumber(userInformation.phoneNumber)

      setImage(userInformation.pfp)
    }
    fun()
  }, [])  // user.data ?

  if (!user)
    navigate('/')

  const navigate = useNavigate()
  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/')
  }

  const updateCV = async () => {
    // console.log(user.data)
    const resp = await dataS.updateData(user.data.toString(), { bio: `${editedCv}` }, user.token)
    // console.log(resp)
    setEdit(!edit)
    setEditText('Edit')
    setCv(editedCv)
  }

  const updateHobbies = async () => {
    // console.log(user.data)
    const resp = await dataS.updateData(user.data.toString(), { hobbies: `${editedHobbies}` }, user.token)
    // console.log(resp)
    setEditHobbies(!editHobbies)
    setEditTextHobbies('Edit')
    setHobbies(editedHobbies)
  }

  const updateExperience = async () => {
    // console.log(user.data)
    const resp = await dataS.updateData(user.data.toString(), { experience: `${editedExp}` }, user.token)
    // console.log(resp)
    setEditExp(!editExp)
    setEditTextExp('Edit')
    setExp(editedExp)
  }
  
  const updateGender = async () => {
    if (!selectedGender)
      return
    console.log(selectedGender)
    const resp = await dataS.updateData(user.data.toString(), { gender: (selectedGender === 'Male' ? 1 : 2) }, user.token)
    setEditGender(!editGender)
    setGender(selectedGender)
  } 

  const updateAddr = async () => {
    const resp = await dataS.updateData(user.data.toString(), { address: newAddress }, user.token)
  }

  const updateNumber = async () => {
    const resp = await userS.updateUserInfo(user.id.toString(), { phoneNumber: newNumber }, user.token)
  }

  let textBoxStyle = {}
  let bioBoxStyle = {}
  let textBoxStyleExp = {}
  let expBoxStyle = {}
  let textBoxStyleHob = {}
  let hobBoxStyle = {}

  let genderSelectorStyle = {}
  let addressChangeStyle = {}
  let numChangeStyle = {}

  {edit ? textBoxStyle={ display: '' } : textBoxStyle={ display: 'none' } }
  {!edit ? bioBoxStyle={ display: '' } : bioBoxStyle={ display: 'none' } }

  {editExp ? textBoxStyleExp={ display: '' } : textBoxStyleExp={ display: 'none' } }
  {!editExp ? expBoxStyle={ display: '' } : expBoxStyle={ display: 'none' } }
  
  {editHobbies ? textBoxStyleHob={ display: '' } : textBoxStyleHob={ display: 'none' } }
  {!editHobbies ? hobBoxStyle={ display: '' } : hobBoxStyle={ display: 'none' } }

  {editGender ? genderSelectorStyle={ display: '' } : genderSelectorStyle={ display: 'none' } }
  {editAddress ? addressChangeStyle={ display: '' } : addressChangeStyle={ display: 'none' } }
  {editNumber ? numChangeStyle={ display: '' } : numChangeStyle={ display: 'none' } }

  return (
    <>
      <div style={{backgroundColor  : 'black'}} >
        <Link className='button' to="/" >Home</Link>
        <Link className='button' to="/home/network">Network</Link>
        <Link className='button' to="/home/ads">Ads</Link>
        <Link className='button' to="/home/messages">Messages</Link>
        <Link className='button' to="/home/notifications">Notifications</Link>
        <Link className='button' to="/home/personal_info" style={{backgroundColor: '#48c1df'}}>Personal</Link>
        <Link className='button' to="/home/settings">Settings</Link>
        <button className='button' style={{ float: 'right', backgroundColor: '#ff1a1a' }} onClick={logout} >Logout</button>
      </div>
      <div>
        {(user && userInf) ?
        <div className='usrInfoOuter'>
        <div className='usrInfoInner'>
          <div style={{marginLeft:'8%'}}>
          <h2 style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>Your info:</h2>
          <p>Name: {user.firstName} {user.lastName}</p><img className='fpfPicture' src={image} />
          <p>Email: {user.email}</p>
          <p>Phone number: {userInf.phoneNumber ? <div>{number}</div> : 'Not specified '}<button className='buttonChange' onClick={() => setEditNumber(!editNumber)}> Change</button></p>

          <div style={numChangeStyle}>
          <form style={{ marginRight: '85%', display: 'block' }} onSubmit={(event) => {
            event.preventDefault()
            if (!/^([0-9]{8,})$/.test(newNumber))
              return 
            setEditNumber(!editNumber)
            setNumber(newNumber)
            updateNumber()
          }}>
            <fieldset>
              <legend>Type your number:</legend>
              <div>
                <input type='text' id='numText' value={newNumber} onChange={(event) => setNewNumber(event.target.value)}/>
              </div>
              <button type='submit' className='buttonChange' style={{float: 'right', background: 'linear-gradient(180deg, #4B91F7 0%, #da42a0 100%)'}}>Submit</button>
            </fieldset>
          </form>
          </div>

          <p>Address: {address ? <div>{address} </div> : 'Not specified '}<button className='buttonChange' onClick={() => setEditAddress(!editAddress)}> Change</button></p>

          <div style={addressChangeStyle}>
          <form style={{ marginRight: '75%', display: 'block' }} onSubmit={(event) => {
            event.preventDefault()
            setEditAddress(!editAddress)
            setAddress(newAddress)
            updateAddr()
          }}>
            <fieldset>
              <legend>Type your address:</legend>
              <div>
                <input type='text' id='adressText' value={newAddress} onChange={(event) => setNewAddress(event.target.value)}/>
              </div>
              <button type='submit' className='buttonChange' style={{float: 'right', background: 'linear-gradient(180deg, #4B91F7 0%, #da42a0 100%)'}}>Submit</button>
            </fieldset>
          </form>
          </div>

          <p>Gender: {gender ? `${gender} ` :  'Not specified ' }<button className='buttonChange' onClick={() => setEditGender(!editGender)}> Change</button></p>
          
          <div style={genderSelectorStyle}>
          <form onSubmit={(event) => {
            event.preventDefault()
            updateGender()
          }} style={{ marginRight: '65%' }}>
            <fieldset>
              <legend>Select a gender:</legend>
              <div>
                <input type='radio' id='femaleRadio' name='gen' value='Female' onChange={(event) => {setSelectedGender(event.target.value)}} />
                <label for='femaleRadio'>Female</label>
              </div>
              <div>
                <input type='radio' id='maleRadio' name='gen' value='Male' onChange={(event) => {setSelectedGender(event.target.value)}} />
                <label for='maleRadio'>Male</label>
              </div>
              <button type='submit' className='buttonChange' style={{float: 'right', background: 'linear-gradient(180deg, #4B91F7 0%, #da42a0 100%)'}}>Submit</button>
            </fieldset>
          </form>
          </div>
          <button className='buttonChange' style={{float: 'right', background: 'linear-gradient(180deg, #4B91F7 0%, #da42a0 100%)'}}>Edit Profile Image</button>

        </div>
        </div>
        </div>  
        : ''}
        <h2>Your CV:</h2>
          <div className=''>
            <div style={bioBoxStyle} className='bioText' >
              {usrData ? 
                <div style={{whiteSpace: 'pre-line'}}>{cv}</div>
                : ''
              }
            </div>
            <div style={textBoxStyle}>
              <textarea name="Text1" cols="40" rows="5" value={editedCv} onChange={(event) => setEditedCv(event.target.value)}></textarea>
              <br />
            </div>
            <button onClick={updateCV} style={textBoxStyle} className='savebtn' >Save changes</button>
            <div style={{float: 'right'}}>
              <div style={textBoxStyle}>
                <input type="checkbox" />  This info is private
              </div>
            </div>
            <button className='cancelbtn' onClick={() => {
              setEdit(!edit)
              editText === 'Edit' ? setEditText('Cancel') : setEditText('Edit')
              setEditedCv(cv)
            }}>{editText}</button>
          </div>

        <h2>Your Experience:</h2>
          <div style={expBoxStyle} className='bioText' >
            {usrData ? 
              <div style={{whiteSpace: 'pre-line'}}>{exp}</div>
              : ''
            }
          </div>
          <div style={textBoxStyleExp}>
            <textarea name="Text2" cols="40" rows="5" value={editedExp} onChange={(event) => setEditedExp(event.target.value)}></textarea>
            <br />
          </div>
          <button onClick={updateExperience} style={textBoxStyleExp} className='savebtn' >Save changes</button>
          <div style={{float: 'right'}}>
            <div style={textBoxStyleExp}>
              <input type="checkbox" />  This info is private
            </div>
          </div>
          <button className='cancelbtn' onClick={() => {
            setEditExp(!editExp)
            editTextExp === 'Edit' ? setEditTextExp('Cancel') : setEditTextExp('Edit')
            setEditedExp(exp)
          }}>{editTextExp}</button>

        <h2>Your Hobbies:</h2>
          <div style={hobBoxStyle} className='bioText' >
            {usrData ? 
              <div style={{whiteSpace: 'pre-line'}}>{hobbies}</div>
              : ''
            }
          </div>
          <div style={textBoxStyleHob}>
            <textarea name="Text3" cols="40" rows="5" value={editedHobbies} onChange={(event) => setEditedHobbies(event.target.value)}></textarea>
            <br />
          </div>
          <button onClick={updateHobbies} style={textBoxStyleHob} className='savebtn' >Save changes</button>
          <div style={{float: 'right'}}>
            <div style={textBoxStyleHob}>
              <input type="checkbox" />  This info is private
            </div>
          </div>
          <button className='cancelbtn' onClick={() => {
            setEditHobbies(!editHobbies)
            editTextHobbies === 'Edit' ? setEditTextHobbies('Cancel') : setEditTextHobbies('Edit')
            setEditedHobbies(hobbies)
          }}>{editTextHobbies}</button>
          
      </div>
    </>
  )
}

export default Personal