import { useState, useEffect } from 'react'
import userS from '../services/user'
import {
  useNavigate
} from 'react-router-dom'
import { js2xml } from 'xml-js'
import isAuthenticated from '../services/authCheck'

const Admin_Page = ({user, setuser}) => {
  const navigate = useNavigate()
  const [allData, setAllData] = useState(null)
  const [upd, setUpd] = useState(false)
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')

  const logout = () => {
    setuser(null)
    window.localStorage.clear()
    navigate('/')
  }
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

export default Admin_Page