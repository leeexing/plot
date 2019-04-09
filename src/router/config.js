import mobileRoutes from './mobile'
import rootRoutes from './rootRoute'
import appRoutes from './web'

let childRoutes = [
  rootRoutes,
  mobileRoutes,
  appRoutes
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
