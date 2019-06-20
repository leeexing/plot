// export { default } from './NotFound'
import loadable from '@loadable/component'

const NotFound = loadable(() => import('./NotFound'))

export default NotFound
