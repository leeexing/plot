import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'

import { HOST } from '@/config'
import AppRoutes from './app'
import Login from 'pages/Login'
import LoginOther from 'pages/Login/LoginOther.jsx'
import {TestHomepage, TestImage, Feedback, TestThanks } from 'pages/TestMobile'

const Routes = () => (
  <Router>
    <React.Fragment>
      <Switch>
        <Route path={`/${HOST}mobile`} exact component={TestHomepage}/>
        <Route path={`/${HOST}mobile/image`} exact component={TestImage}/>
        <Route path={`/${HOST}mobile/feedback`} exact component={Feedback}/>
        <Route path={`/${HOST}mobile/thanks`} exact component={TestThanks}/>
        <Route path={`/${HOST}login`} exact component={Login}/>
        <Route path={`/${HOST}loginOther`} exact component={LoginOther}/>
        <Route component={AppRoutes}/>
      </Switch>
    </React.Fragment>
  </Router>
)

export default Routes
