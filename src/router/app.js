import Layout from 'components/Layout'
import Home from 'pages/Homepage'
import { ImagePlot, ImagePlotList } from 'pages/ImagePlot'
import UploadDetail from 'pages/Upload'
import NotFound from 'pages/404page'
import ServerError from 'pages/500page'
import Download from 'pages/Download'
import About from 'pages/About'
import Refresh from 'components/RefreshBlank'

export const menuRoutes = [
  { path: 'home', name: '首页', icon: 'appstore', component: Home },
  { path: 'plot', name: '标图素材', icon: 'pie-chart', component: ImagePlotList },
  { path: 'download', name: '标图下载', icon: 'cloud-download', component: Download },
  { path: 'about', name: '关于', icon: 'info-circle', component: About }
]

export default {
  path: '/',
  name: 'home',
  component: Layout,
  children: [
    ...menuRoutes,
    { path: '', name: '跳转到登录页', icon: 'swap', component: null },
    { path: 'refresh', name: '路由伪刷新', component: Refresh },
    { path: 'plot/:batchId', name: '标图详情', component: ImagePlot },
    { path: 'log/:taskId', name: '日志详情', component: UploadDetail },
    { path: '500', name: '错误页', component: ServerError },
    { path: '*', name: '未知页', component: NotFound }
  ]
}
