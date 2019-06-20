import React, { Component } from 'react'
import { inject, observer }  from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { Avatar, Menu, Icon, Dropdown } from 'antd'

import { MenuMini } from 'components/Sider'
import NavBreadcrumb from './NavBreadcrumb'
import avatarImg from '@/assets/admin_avatar.png'


@withRouter
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

  onClick = ({ key }) => {
    if (key === 'logout') {
      this.props.userStore.logout()
      this.props.history.push('/login')
    }
  }

  render () {
    const menu = (
      <Menu onClick={this.onClick}>
        {/* <Menu.Item key="0">
          <Link to="/todo">个人中心</Link>
        </Menu.Item> */}
        {/* <Menu.Divider /> */}
        <Menu.Item key="logout">退出登录</Menu.Item>
      </Menu>
    )
    let { username, avatar } = this.props.userStore
    return (
      <nav className="app-nav">
        <div className="app-nav-bd">
          <div className="nav-breadcrumb">
            <NavBreadcrumb></NavBreadcrumb>
          </div>
          <MenuMini></MenuMini>
          <div className="nav-app-title">
            <Icon type="cloud" style={{marginRight: "5px"}} />
            安培云·在线标注平台
          </div>
          <div className="nav-app-title-mini">
            <Icon type="cloud" style={{marginRight: "5px"}} />
            在线标注平台
          </div>
          <div className="nav-user">
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
              <span className="ant-dropdown-link">
                {username || 'Nuctech'}
                <Icon type="down" size="24" style={{marginLeft: '5px'}} />
              </span>
            </Dropdown>
            <Avatar className="nav-user-avatar" src={avatar || avatarImg} />
            {/* <Avatar className="nav-user-avatar" icon="user" /> */}
          </div>
        </div>
      </nav>
    )
  }
}

export default NavBar
