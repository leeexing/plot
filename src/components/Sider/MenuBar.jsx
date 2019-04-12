import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Menu, Icon } from 'antd'

import logoMd from 'assets/logo-md.png'
import logoMini from 'assets/logo-mini.png'
import { menuRoutes } from '@/router/app'


@withRouter
@inject('appStore')
@observer
class MenuBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false,
    }
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
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

    return (
      <div className="app-menu">
      {/* <div className="app-menu" style={{ width: this.state.collapsed ? 80 : 200 }}> */}
        <div className="logo-con" onClick={this.toggleCollapsed}>
          {this.state.collapsed
            ? <img src={logoMini} alt="logo-mini" />
            : <img src={logoMd} alt="logo" />
          }
        </div>
        <Menu
          onClick={this.onMenuClick}
          className="app-menu-list"
          defaultSelectedKeys={[path]}
          selectedKeys={[path]}
          mode="inline"
          inlineCollapsed={this.state.collapsed}
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
      </div>
    )
  }
}

export default MenuBar
