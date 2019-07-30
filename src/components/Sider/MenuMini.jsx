import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Menu, Icon, Dropdown } from 'antd'

import { menuRoutes } from '@/router/app'
import logoMini from 'assets/logo-mini.png'


@withRouter
@inject('appStore')
@observer
class MenuBar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onMenuClick = ({ key }) => {
    let curRoute = this.props.location.pathname
    if (curRoute === key) {
      this.props.history.push('/refresh')
    } else {
      let route = menuRoutes.filter(item => '/' + item.path === key)
      this.props.appStore.updateNavBreadcrumb(route)
      this.props.history.push(key)
    }
  }

  render() {
    let path = this.props.location.pathname
    const menu = (
      <Menu
        onClick={this.onMenuClick}
        className="app-menu-list"
        defaultSelectedKeys={[path]}
        selectedKeys={[path]}
      >
        {
          menuRoutes.map(item => (
            <Menu.Item key={`/${item.path}`}>
              <Icon type={item.icon} />
              <span>{item.name}</span>
            </Menu.Item>
          ))
        }
      </Menu>
    )

    return (
      <div className="app-menu-mini">
        <div className="logo-con">
          <img src={logoMini} alt="logo-mini" />
        </div>
        <Dropdown overlay={menu} trigger={['click']}>
          <span className="ant-dropdown-link app-menu-mini-icon" href="#">
            <Icon type="menu" style={{ color: '#69c0ff' }} /> 菜单
          </span>
        </Dropdown>
      </div>
    )
  }
}

export default MenuBar
