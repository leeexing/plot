// export { default } from './TodoMain'
import loadable from '@loadable/component'

const TodoMain = loadable(() => import('./TodoMain'))

export default TodoMain
