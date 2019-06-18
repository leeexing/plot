import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

import routes from './config'


@inject('userStore')
@observer
class Router extends Component {

  /**
   * 根据路由表生成路由组件
   * 根据用户是否登录判断，当用户输入跟路由 '/' 时，是跳转到 '/home' 还是 '/login' 页面
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
      } else {
        children.push(
          <Route
            key="redirect"
            path="/"
            exact
            render={() => (
              this.props.userStore.isLogined
              ? <Redirect to="/home"/>
              : <Redirect to="/login"/>
            )}
          />
        )
      }
    }

    routes.forEach(item => renderRoute(item, contextPath))

    // console.log('children', children)

    return <Switch>{children}</Switch>
  }

  render () {
    const children = this.renderRoutes(routes, '/')
    return <BrowserRouter>{children}</BrowserRouter>
  }
}

export default Router

