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

const SearchResult = ({result}) => {
    const navigate = useNavigate()
    return(
        <div>
            <hr />
            {result.fullName}
            <button className='savebtn' onClick={() => {navigate(`/profile/${result.id}`)}}>Visit Profile</button>
        </div>
    )
}

const OneConnected = ({pr}) => {
    const [persn, setPersn] = useState('')
    const [prData, setPrData] = useState('')
    useEffect(() => {
        const fun = async () => {
            const person = await userS.userInfo(pr)
            setPersn(person)
            // console.log(persn)

            const personData = await dataS.userData(person.userData.toString())
            setPrData(personData)
            // console.log(prData)
        }
        fun()
    }, [])

    const printPfP = () => {
        if (pr.pfp===null){
            return ('no pfp')
        } else {
            return (<img style={{float:'right', width:'10%'}} src={persn.pfp} />)
        }
    }

    const printWorks= () => {
        if (prData.works===null){
            return ('...')
        } else {
            return (prData.works)
        }
    }

    const printPos = () => {
        if (prData.position===null){
            return('...')
        } else {
            return (prData.position)
        }
    }

    const navigate = useNavigate()

    if (persn) {
        return (
            <div>
                <hr />
                <h2>{persn.firstName} {persn.lastName} {printPfP()} </h2>  
                <h3>Works in: {printWorks()}</h3>
                <h3>Current position: {printPos()}</h3>
                <button className='savebtn' onClick={() => {navigate(`/profile/${pr}`)}}>Visit Profile</button>
                <button className='cancelbtn'>Remove from Network</button>
            </div>
        )
    }
}


const Network = ({user, setUser}) => {

    const [usrData, setUsrData] = useState(null)
    useEffect(() => {
        const fun = async () => {
            const data = await dataS.userData(user.data.toString())
            setUsrData(data)
        }
        fun()
    }, [])

    const [newSearch, setNewSearch] = useState('')
    const [searchList, setSearchList] = useState([])

    const onChangeHandler = async (value) => {
        setNewSearch(value)
        const allUsers = await userS.getAllUserData(user.token)
        let fullNames = []
        for (let usr of allUsers){
            fullNames.push({fullName: usr.firstName + ' ' + usr.lastName, id: usr.id})
        }
        let matches = []
        for (let i = 0; i<fullNames.length; i++){
            if (fullNames[i].fullName.toLowerCase().includes(newSearch.toLowerCase())){
                matches.push(fullNames[i])
            }
        }
        console.log(matches)
        setSearchList(matches)
    }

    const navigate = useNavigate()
    if (!user)
        navigate('/')
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

            <div>
                {usrData && user ?
                    <div className='container_home'>
                        <div className='column_left_home' style={{width: '30%'}}>
                            <div className='usrInfoOuter' style={{ marginTop: '0'}}>
                                <div className='usrInfoInner' style={{ width: '90%' }}>
                                    <h1 style={{ textAlign: 'center' }}>SEARCH</h1>
                                    <h2 style={{textAlign:'center'}}>Search users by name<br />
                                        <input style={{width:'100%'}} value={newSearch} onChange={(event) => onChangeHandler(event.target.value)} />
                                    </h2>
                                    <ul>
                                        {searchList.map((res) =>
                                            <SearchResult result={res} key={res} />
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='column_right_home'>
                            <div className='usrInfoOuter' style={{ marginTop: '0'}}>
                                <div className='usrInfoInner' style={{ width: '100%' }}>
                                    <h1 style={{ textAlign: 'center' }}>MY NETWORK</h1>
                                    {usrData.network.length ?
                                        <ul>
                                            {usrData.network.map((person) =>
                                                <OneConnected pr={person} key={person} />
                                            )}
                                        </ul>
                                        :
                                        <div>Network empty</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                : 'ERROR'}
            </div>
        </>
    )
}

export default Network