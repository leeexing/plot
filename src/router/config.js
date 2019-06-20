// import mobileRoutes from './mobile' // -测试手机端图像显示相关的页面
import rootRoutes from './rootRoute'
import appRoutes from './app'

let childRoutes = [
  rootRoutes,
  // mobileRoutes,
  appRoutes,
]

const routes = [
  ...childRoutes.filter(route => route.children && route.children.length > 0)
]

function handleIndexRoute (route) {
  if (!route.children || !route.children.length) {
    return
  }
  const indexRoute = route.children.find(item => item.isIndex)
  if (indexRoute) {
    const first = {...indexRoute}
    first.path = ''
    first.exact = true
    first.autoIndexRoute = true
    first.children.unshift(fitst)
  }
  route.children.forEach(handleIndexRoute)
}

routes.forEach(handleIndexRoute)

export default routes
