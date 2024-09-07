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

const AllConnected = () => { }


// const OneConnected = () => {
//     const navigate = useNavigate()
//     const [persn, setPersn] = useState(null)
//     useEffect(() => {
//         const fun = async () => {
//             const person = await userS.userInfo(usrData)
//             setPersn(person)
//         }
//         fun()
//     }, [])

//     if (persn) {
//         return (
//             <div>
//                 <div>
//                     <p>{persn.firstName} {persn.lastName} {usrData.ad}</p>
//                 </div>
//             </div>
//         )
//     }
// }


const Network = ({user, setUser}) => {

    const [usrData, setUsrData] = useState(null)
    useEffect(() => {
        const fun = async () => {
            const data = await dataS.userData(user.data.toString())
            setUsrData(data)
        }
        fun()
    }, [])

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
            {/* <img src='../name.png' /> */}
            <div>
                {usrData && user ?
                    <div className='container_home'>
                        <div className='column_left_home'>
                            <h1 style={{ textAlign: 'center' }}>SEARCH</h1>
                        </div>
                        <div className='column_right_home'>
                            <h1 style={{ textAlign: 'center' }}>MY NETWORK</h1>
                            {usrData.network.length ?
                                <div>

                                </div>
                                :
                                <div>No friends :(</div>
                            }
                        </div>
                    </div>
                    : ''}
            </div>
        </>
    )
}

export default Network