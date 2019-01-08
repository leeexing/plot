import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { BackTop } from 'antd'
import Todo from 'pages/todos'
import MenuBar from 'components/MenuBar'
import NavBar from 'components/NavBar'
import NotFoundRoute from 'pages/404page'
import HomePage from 'pages/Homepage'
import { ImagePlot, ImagePlotDetail } from 'pages/ImagePlot'

const host = ''
const Routes = () => (
  <React.Fragment>
    <MenuBar />
    <main className="app-main">
      <NavBar />
      <section className="app-content">
        <Switch>
          <Route path={`/${host}todo`} component={Todo}/>
          <Route path={`/${host}plot/:imageId`} component={ImagePlotDetail}/>
          <Route path={`/${host}plot`} component={ImagePlot}/>
          <Route path={`/${host}`} exact component={HomePage}/>
          <Route path={'/*'} component={NotFoundRoute}/>
        </Switch>
      </section>
    </main>
    <BackTop/>
  </React.Fragment>
)

export default Routes
