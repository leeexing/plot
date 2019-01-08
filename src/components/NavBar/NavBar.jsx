import React, { Component } from 'react'
import { inject, observer }  from 'mobx-react'
import { Avatar, Menu, Icon, Dropdown } from 'antd'
import { Link } from 'react-router-dom'


const menu = (
  <Menu>
    <Menu.Item key="0">
      <Link to="/todo">个人中心</Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="1">
      <Link to="/login">退出登录</Link>
    </Menu.Item>
  </Menu>
)

@inject('appStore')
@observer
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
    }
  }
  componentDidMount () {
    console.log(this.props.appStore.username)
    console.log(this.props.appStore.rootStore.userStore)
  }
  logout () {
    this.props.dispatch({type: 'LOGOUT'})
    this.props.history.push('/login')
  }
  render () {
    return (
      <nav className="app-nav">
        <div className="app-nav-bd">
          <div className="nav-items">
            <ul>
              {this.state.navItems.map((nav, index) =>
                  <li key={index}><Link to={nav.path}>{nav.name}</Link></li>
                )
              }
            </ul>
          </div>
          <div className="nav-user">
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
              <span className="ant-dropdown-link">
                {this.props.appStore.username || 'Nuctech'}
                <Icon type="down" size="24" style={{marginLeft: '5px'}} />
              </span>
            </Dropdown>
            <Avatar className="nav-user-avatar" icon="user" />
          </div>
        </div>
      </nav>
    )
  }
}

export default NavBar
