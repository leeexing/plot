import React, { Component } from 'react'
import { inject, observer }  from 'mobx-react'
import { Avatar, Menu, Icon, Dropdown } from 'antd'
import { Link } from 'react-router-dom'
import NavBreadcrumb from './NavBreadcrumb'


@inject('appStore', 'userStore')
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
    // console.log(this.props.appStore.username)
    // console.log(this.props.appStore.rootStore.userStore)
  }
  onClick = ({ key }) => {
    if (key === 'logout') {
      this.props.userStore.logout()
      this.props.history.push('/login')
    }
  }
  render () {
    const menu = (
      <Menu onClick={this.onClick}>
        <Menu.Item key="0">
          <Link to="/todo">个人中心</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">退出登录</Menu.Item>
      </Menu>
    )
    return (
      <nav className="app-nav">
        <div className="app-nav-bd">
          <div className="nav-breadcrumb">
            <NavBreadcrumb></NavBreadcrumb>
            {/* <ul>
              {this.state.navItems.map((nav, index) =>
                  <li key={index}><Link to={nav.path}>{nav.name}</Link></li>
                )
              }
            </ul> */}
          </div>
          <div className="nav-user">
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
              <span className="ant-dropdown-link">
                {this.props.userStore.username || 'Nuctech'}
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
