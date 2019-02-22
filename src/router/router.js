import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './app'
import Login from 'pages/Login'
import LoginOther from 'pages/Login/LoginOther.jsx'
import ServerError from 'pages/500page'

const host = ''
const Routes = () => (
  <Router>
    <React.Fragment>
      <Switch>
        <Route path={`/${host}login`} exact component={Login}/>
        <Route path={`/${host}loginOther`} exact component={LoginOther}/>
        <Route path={`/${host}500`} exact component={ServerError}/>
        <Route component={AppRoutes}/>
      </Switch>
    </React.Fragment>
  </Router>
)

export default Routes
