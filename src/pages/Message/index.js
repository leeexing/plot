// export { default } from './Message'
import loadable from '@loadable/component'

const Message = loadable(() => import('./Message'))

export default Message
