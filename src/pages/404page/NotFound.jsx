import React from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'


import './style.less'
import notFoundImg from 'assets/404.png'


function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound-img">
        <img src={notFoundImg} alt=""/>
      </div>
      <div className="notfound-msg">
        <h2>你想访问的页面不存在</h2>
        <Button type="primary"><Link to="/">返回首页</Link></Button>
      </div>
    </div>
  )
}

export default NotFound
