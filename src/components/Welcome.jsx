import {
  Link
} from 'react-router-dom'

const Welcome = () => {
  return (
    <div>
      <div className='logoDiv' >
        <a href='/' ><img src='../name.png' className='imageLogo' /></a>
      </div>

      <div className='formGrandpa'>
        <div className='formParent'>

          <div className='forms' style={{width: '600px',  backgroundColor: 'rgba(255,255,255,0.6)'}}>
            <img src='./thunder.png' className='imageLogo'/>
            <h2 className='blk'>Get started with PluggedIn</h2>
            <div style={{marginBottom: '2%'}}>
              <Link to="/login"><button className='savebtn' style={{marginRight: '5px', background:'#22B8D9'}}>Login</button></Link>
              <Link to="/register" ><button className='savebtn'>Join Now</button></Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Welcome