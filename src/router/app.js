import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { BackTop } from 'antd'
import Todo from 'pages/Todos'
import MenuBar from 'components/MenuBar'
import NavBar from 'components/NavBar'
import NotFoundRoute from 'pages/404page'
import HomePage from 'pages/Homepage'
import { ImagePlot, ImagePlotDetail } from 'pages/ImagePlot'
import ImageUpload from 'pages/ImageUpload'
import GlobalUploader from 'components/GlobalUploader'
import ImageDownload from 'pages/ImageDownload'

const host = ''
const Routes = (props) => (
  <React.Fragment>
    <MenuBar {...props}/>
    <main className="app-main">
      <NavBar {...props}/>
      <section className="app-content">
        <Switch>
          <Route path={`/${host}todo`} component={Todo}/>
          <Route path={`/${host}plot/:imageId`} component={ImagePlotDetail}/>
          <Route path={`/${host}plot`} component={ImagePlot}/>
          <Route path={`/${host}upload`} component={ImageUpload}/>
          <Route path={`/${host}download`} component={ImageDownload}/>
          <Route path={`/${host}`} exact component={HomePage}/>
          <Route path={'/*'} component={NotFoundRoute}/>
        </Switch>
        <GlobalUploader/>
      </section>
    </main>
    <BackTop/>
  </React.Fragment>
)

export default Routes
