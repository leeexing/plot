import React, { Component } from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

import { menuRoutes } from '@/router/app'


@inject('appStore')
@observer
class NavBreadcrumb extends Component {

  onHandleRouteChange(key) {
    let route = menuRoutes.filter(item => item.path === key)
    this.props.appStore.updateNavBreadcrumb(route)
  }

  render() {
    const routes = this.props.appStore.navBreadcrumbRouters
    return (
      <Breadcrumb>
      {routes.map((route, index) => {
          if (index === routes.length - 1) {
            return <Breadcrumb.Item className="Item" key={route.path}><span>{route.name}</span></Breadcrumb.Item>
          } else {
            return <Breadcrumb.Item className="Item" key={route.path}>
                    <Link onClick={this.onHandleRouteChange.bind(this, route.path)} to={'/' + route.path}>{route.name}</Link>
                  </Breadcrumb.Item>
          }
        })
      }
      </Breadcrumb>
    )
  }
}

export default NavBreadcrumb
