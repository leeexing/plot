// export { default } from './Download'
import loadable from '@loadable/component'

const Download = loadable(() => import('./Download'))

export default Download
