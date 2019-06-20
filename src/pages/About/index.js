// export { default } from './About'
import loadable from '@loadable/component'

const About = loadable(() => import('./About'))

export default About
