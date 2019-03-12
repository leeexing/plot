import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './style.less'
import serverErrorImg from 'assets/500.png'

class ServerError extends Component {
  constructor (props) {
    super(props)
    this.state = {
      remainTime: 3
    }
  }
  render () {
    return (
      <div className="server-error">
        <div className="server-error-img">
          <img src={serverErrorImg} alt=""/>
        </div>
        <div className="server-error-msg">
          <h2>服务器错误</h2>
          <p>{this.state.remainTime}秒后 <Link className="server-error-back" to="/">返回首页</Link></p>
        </div>
      </div>
    )
  }
}

export default ServerError
