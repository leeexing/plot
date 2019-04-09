import Layout from 'components/Layout'
import Home from 'pages/Homepage'
import Todo from 'pages/Todos'
import { ImagePlot, ImagePlotList } from 'pages/ImagePlot'
import Message from 'pages/Message'
import GlobalUploader from 'components/GlobalUploader'
import NotFound from 'pages/404page'
import ServerError from 'pages/500page'

export default {
  path: '/',
  name: 'home',
  component: Layout,
  children: [
    { path: '', component: Home },
    { path: 'todo', component: Todo },
    { path: 'plot/:batch', component: ImagePlot },
    { path: 'plot', component: ImagePlotList },
    { path: 'message', component: Message },
    { path: 'upload', component: GlobalUploader },
    { path: '500', component: ServerError },
    { path: '*', component: NotFound },
  ]
}
