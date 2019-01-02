import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './app'
import { Login } from 'src/pages/Login'

const host = ''
const Routes = () => (
  <Router>
    <React.Fragment>
      <Switch>
        <Route path={`/${host}login`} exact component={Login}/>
        <Route component={AppRoutes}/>
      </Switch>
    </React.Fragment>
  </Router>
)

export default Routes
