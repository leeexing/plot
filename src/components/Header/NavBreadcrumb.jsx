import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import { inject, observer } from 'mobx-react'

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
class NavBreadcrumb extends Component {

  onHandleRouteChange (key) {
    let route = menuRoutes.filter(item => item.path === key)
    this.props.appStore.updateNavBreadcrumb(route)
    // this.props.history.push(key)
  }

  render () {
    const routes = this.props.appStore.navBreadcrumbRouters
    return (
      <Breadcrumb>
      {
        routes.map((route, index) => {
          if (index === routes.length - 1) {
            return <Breadcrumb.Item className="Item" key={route.path}><span>{route.breadcrumbName}</span></Breadcrumb.Item>
          } else {
            return <Breadcrumb.Item className="Item" key={route.path}>
                    <Link onClick={this.onHandleRouteChange.bind(this, route.path)} to={route.path}>{route.breadcrumbName}</Link>
                  </Breadcrumb.Item>
          }
        })
      }
      </Breadcrumb>
    )
  }
}

export default NavBreadcrumb
