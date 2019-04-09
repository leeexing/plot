// export { default } from './router'

import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import routes from './config'

console.log(routes)

class Root extends Component {
  static defaultProps = {
    isLogin: false
  }

  componentDidMount () {
    console.log(this.props)
  }

  /**
   * 根据路由表生成路由组件
   */
  renderRoutes (routes, contextPath) {
    const children = []

    const renderRoute = (item, routeCtxPath) => {
      let newCtxPath = item.path ? `${routeCtxPath}/${item.path}` : routeCtxPath
      newCtxPath = newCtxPath.replace(/\/+/g, '/')

      if (item.component && item.children) {
        const childRoutes = this.renderRoutes(item.children, newCtxPath)
        children.push(
          <Route
            key={newCtxPath}
            render={props => <item.component {...props}>{childRoutes}</item.component>}
          />
        )
      } else if (item.component) {
        children.push(
          <Route
            key={newCtxPath}
            component={item.component}
            path={newCtxPath}
            exact
          />
        )
      } else if (item.children) {
        item.children.forEach(item => renderRoute(item, newCtxPath))
      }
    }

    routes.forEach(item => renderRoute(item, contextPath))

    console.log('children', children)

    return <Switch>{children}</Switch>
  }

  render () {
    const children = this.renderRoutes(routes, '/')
    return <BrowserRouter>{children}</BrowserRouter>
  }
}

export default Root

