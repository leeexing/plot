import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { BackTop } from 'antd'

import Todo from 'pages/Todos'
import MenuBar from 'components/MenuBar'
import NavBar from 'components/NavBar'
import HomePage from 'pages/Homepage'
import { ImagePlot, ImagePlotList } from 'pages/ImagePlot'
import Message from 'pages/Message'
import GlobalUploader from 'components/GlobalUploader'
import NotFoundRoute from 'pages/404page'
// import GlobalMessage from 'components/GlobalMessage'


const host = ''
const Routes = (props) => (
  <React.Fragment>
    <MenuBar {...props}/>
    <main className="app-main">
      <NavBar {...props}/>
      <section className="app-content">
        <Switch>
          <Route path={`/${host}todo`} component={Todo}/>
          <Route path={`/${host}plot/:batch`} component={ImagePlot}/>
          <Route path={`/${host}plot`} component={ImagePlotList}/>
          <Route path={`/${host}message`} component={Message}/>
          <Route path={`/${host}`} exact component={HomePage}/>
          <Route path={'/*'} component={NotFoundRoute}/>
        </Switch>
      </section>
    </main>
    <GlobalUploader/>
    {/* <GlobalMessage/> */}
    <BackTop/>
  </React.Fragment>
)

export default Routes
