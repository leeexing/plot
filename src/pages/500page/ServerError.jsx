import React from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'


import './style.less'
import serverErrorImg from 'assets/500.png'


function ServerError(props)  {

  return (
    <div className="server-error">
      <div className="server-error-img">
        <img src={serverErrorImg} alt=""/>
      </div>
      <div className="server-error-msg">
        <Button type="primary" style={{ marginRight: '10px' }}><Link to="/">返回首页</Link></Button>
        <Button type="primary" onClick={() => props.history.go(-1)}>返回上一页</Button>
      </div>
    </div>
  )
}

export default ServerError
