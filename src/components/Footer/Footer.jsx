import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Footer extends Component {
  render () {
    return (
      <footer className="app-footer">
        <div className="copyright">© 2005－2018 douban.com, all rights reserved 北京豆网科技有限公司</div>
        <div className="link">
          <Link to="/">关于豆瓣</Link>·
          <Link to="/">在豆瓣工作</Link>·
          <Link to="/">联系我们</Link>·
          <Link to="/">免责声明</Link>·
          <Link to="/">帮助中心</Link>·
          <Link to="/">手机音乐</Link>·
          <Link to="/">豆瓣广告</Link>
        </div>
      </footer>
    )
  }
}

export default Footer
