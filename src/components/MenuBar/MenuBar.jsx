import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Menu, Icon } from 'antd'
import logoMd from 'assets/logo-md.png'
import logoMini from 'assets/logo-mini.png'


const menuRoutes = [
  {
    path: '/',
    breadcrumbName: '首页'
  },
  {
    path: '/plot',
    breadcrumbName: '标图素材'
  },
  {
    path: '/upload',
    breadcrumbName: '图像上传'
  },
]

@inject('appStore')
@observer
class MenuBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false,
    }
  }
  componentDidMount () {
    // console.log(this.props)
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
  onMenuClick = ({ key }) => {
    let route = menuRoutes.filter(item => item.path === key)
    this.props.appStore.updateNavBreadcrumb(route)
    this.props.history.push(key)
  }
  render() {
    let path = this.props.location.pathname
    let selectKey = path === '/' ? '/' : '/' + path.split('/')[1]
    return (
      <div className="app-menu" style={{ width: this.state.collapsed ? 80 : 200 }}>
        <div className="logo-con" onClick={this.toggleCollapsed}>
          {this.state.collapsed
            ? <img src={logoMini} alt="logo-mini" />
            : <img src={logoMd} alt="logo" />
          }
        </div>
        <Menu
          onClick={this.onMenuClick}
          className="app-menu-list"
          defaultSelectedKeys={[this.props.location.pathname]}
          selectedKeys={[selectKey]}
          mode="inline"
          inlineCollapsed={this.state.collapsed}
        >
          <Menu.Item key="/" to="/">
            <Icon type="appstore" />
            <span>首页</span>
          </Menu.Item>
          <Menu.Item key="/plot">
            <Icon type="pie-chart" />
            <span>标图素材</span>
          </Menu.Item>
          <Menu.Item key="/upload">
            <Icon type="desktop" />
            <span>图像上传</span>
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}

export default MenuBar
