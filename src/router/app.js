import Layout from 'components/Layout'
import Home from 'pages/Homepage'
import Todo from 'pages/Todos'
import { ImagePlot, ImagePlotList } from 'pages/ImagePlot'
import Message from 'pages/Message'
import Upload from 'components/GlobalUploader'
import NotFound from 'pages/404page'
import ServerError from 'pages/500page'
import Download from 'pages/Download'

export const menuRoutes = [
  { path: '', name: '首页', icon: 'appstore', component: Home },
  { path: 'plot', name: '标图素材', icon: 'pie-chart', component: ImagePlotList },
  { path: 'download', name: '标图下载', icon: 'download', component: Download },
]

export default {
  path: '/',
  name: 'home',
  component: Layout,
  children: [
    ...menuRoutes,
    { path: 'todo', name: '待办', component: Todo },
    { path: 'plot/:batch', name: '标图详情', component: ImagePlot },
    { path: 'upload', name: '图像上传', component: Upload },
    { path: 'message', name: '标图下载', icon: 'message', component: Message },
    { path: '500', name: '错误页', component: ServerError },
    { path: '*', name: '未知页', component: NotFound },
  ]
}
