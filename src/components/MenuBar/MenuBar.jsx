import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import logoMd from 'assets/logo-md.png'
import logoMini from 'assets/logo-mini.png'

const SubMenu = Menu.SubMenu


class MenuBar extends Component {
  state = {
    collapsed: false,
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    return (
      <div className="app-menu" style={{ width: this.state.collapsed ? 80 : 200 }}>
        <div className="logo-con" onClick={this.toggleCollapsed}>
          {this.state.collapsed
            ? <img src={logoMini} alt="logo-mini" />
            : <img src={logoMd} alt="logo" />
          }
        </div>
        {/* <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
          <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button> */}
        <Menu
          className="app-menu-list"
          defaultSelectedKeys={['1']}
          mode="inline"
          inlineCollapsed={this.state.collapsed}
        >
          <Menu.Item key="1">
            <Icon type="pie-chart" />
            <span>标图</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="desktop" />
            <span>图像上传</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="inbox" />
            <span>图像下载</span>
          </Menu.Item>
          <SubMenu key="sub1" title={<span><Icon type="mail" /><span>待开发</span></span>}>
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>待开发 2</span></span>}>
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </SubMenu>
        </Menu>
      </div>
    )
  }
}

export default MenuBar
