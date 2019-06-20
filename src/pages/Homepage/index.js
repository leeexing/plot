// export { default } from './HomePage'
import loadable from '@loadable/component'

const HomePage = loadable(() => import('./HomePage'))

export default HomePage
