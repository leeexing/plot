import React, { Component } from 'react'
import { Avatar, Input, Menu, Icon, Dropdown } from 'antd'
import { Link } from 'react-router-dom'
import './style.less'


const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
)

class NavBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isSignIn: this.props.hasLogin || false,
      current: 'home',
      navItems: [
        {
          name: 'NUCTECH',
          path: '/home'
        },{
          name: '安培云',
          path: '/study'
        }
      ],
      navSecondItems: [
        {
          name: '文件上传',
          path: '/'
        }, {
          name: '文件下载',
          path: 'musicweek'
        }, {
          name: '消息盒子',
          path: 'plan'
        }, {
          name: 'todo',
          path: '/todo'
        }
      ]
    }
  }
  logout () {
    this.props.dispatch({type: 'LOGOUT'})
    this.props.history.push('/login')
  }
  render () {
    let hasNoLogin = (
      <div className="nav-info">
        <Dropdown overlay={menu} trigger={['click']}>
          <span className="ant-dropdown-link" style={{display: 'inline-block', 'height': '38px'}}>
            <Avatar style={{ backgroundColor: '#87d068' }} icon="user" />
            <Icon type="down" size="24" />
          </span>
        </Dropdown>
      </div>
    )

    let hasLogin = (
      <div className="nav-info">
        <Link to="/reminder">NUCTECH</Link>
        <Link to="/doumail">安培云</Link>
      </div>
    )
    return (
      <nav className="app-nav">
        <div className="app-nav-bd">
          <div className="nav-items">
            <ul>
              {
                this.state.navItems.map((nav, index) =>
                  <li key={index}><Link to={nav.path}>{nav.name}</Link></li>
                )
              }
            </ul>
          </div>
          <div className="nav-others">
            {
              this.state.isSignIn ? hasLogin : hasNoLogin
            }
          </div>
        </div>
        <div className="app-nav-search">
          <div className="nav-wrap">
            <div className="nav-logo">
              <Link to="/">源数据平台</Link>
            </div>
            <div className="nav-search">
            <Input.Search
              placeholder="图片、消息"
              enterButton
              style={{width: 500}}
              onSearch={value => console.log(value)}
            />
            </div>
          </div>
        </div>
        <div className="app-nav-secondary">
          <div className="nav-wrap">
            <ul>
              {
                this.state.navSecondItems.map((item, index) =>
                  <li key={index}><Link to={item.path}>{item.name}</Link></li>
                )
              }
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default NavBar
