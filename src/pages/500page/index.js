// export { default } from './ServerError'
import loadable from '@loadable/component'

const ServerError = loadable(() => import('./ServerError'))

export default ServerError
