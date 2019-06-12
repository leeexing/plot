import React from 'react'
import { Link } from 'react-router-dom'

import './style.less'
import serverErrorImg from 'assets/500.png'


function ServerError (props)  {

  const backToPrev = () => {
    props.history.go(-1)
  }

  return (
    <div className="server-error">
      <div className="server-error-img">
        <img src={serverErrorImg} alt=""/>
      </div>
      <div className="server-error-msg">
        <p><Link className="server-error-back" to="/">返回首页</Link></p>
        <p><a className="server-error-back" onClick={backToPrev}>返回上一页</a></p>
        {/* <p>{this.state.remainTime}秒后 <Link className="server-error-back" to="/">返回首页</Link></p> */}
      </div>
    </div>
  )
}

export default ServerError
