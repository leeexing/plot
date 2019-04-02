import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { BackTop } from 'antd'

import { HOST } from '@/config'
import Todo from 'pages/Todos'
import MenuBar from 'components/MenuBar'
import NavBar from 'components/NavBar'
import HomePage from 'pages/Homepage'
import { ImagePlot, ImagePlotList } from 'pages/ImagePlot'
import Message from 'pages/Message'
import GlobalUploader from 'components/GlobalUploader'
import NotFoundRoute from 'pages/404page'
import ServerError from 'pages/500page'
import Test from 'pages/TestRedux'
// import GlobalMessage from 'components/GlobalMessage'


const Routes = (props) => (
  <React.Fragment>
    <MenuBar {...props}/>
    <main className="app-main">
      <NavBar {...props}/>
      <section className="app-content">
        <Switch>
          <Route path={`/${HOST}todo`} component={Todo}/>
          <Route path={`/${HOST}plot/:batch`} component={ImagePlot}/>
          <Route path={`/${HOST}plot`} component={ImagePlotList}/>
          <Route path={`/${HOST}message`} component={Message}/>
          <Route path={`/${HOST}Test`} component={Test}/>
          <Route path={`/${HOST}500`} exact component={ServerError}/>
          <Route path={`/${HOST}`} exact component={HomePage}/>
          <Route path={`/*`} component={NotFoundRoute}/>
        </Switch>
      </section>
    </main>
    <GlobalUploader/>
    {/* <GlobalMessage/> */}
    <BackTop/>
  </React.Fragment>
)

export default Routes
