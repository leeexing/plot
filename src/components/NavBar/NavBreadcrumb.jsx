import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import { inject, observer } from 'mobx-react'


@inject('appStore')
@observer
class NavBreadcrumb extends Component {

  render () {
    const routes = this.props.appStore.navBreadcrumbRouters
    return (
      <Breadcrumb style={{color: "#fff"}}>
      {
        routes.map((route, index) => {
          if (index === routes.length - 1) {
            return <Breadcrumb.Item className="Item" key={route.path}><span>{route.breadcrumbName}</span></Breadcrumb.Item>
          } else {
            return <Breadcrumb.Item className="Item" key={route.path}><Link to={route.path}>{route.breadcrumbName}</Link></Breadcrumb.Item>
          }
        })
      }
      </Breadcrumb>
    )
  }
}

export default NavBreadcrumb
