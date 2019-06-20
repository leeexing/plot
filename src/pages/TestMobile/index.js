// export { default as TestImage } from './TestImage'
// export { default as Feedback } from './TestFeedback'
// export { default as TestHomepage } from './TestGuide'
// export { default as TestThanks } from './TestThanks'
import loadable from '@loadable/component'

const TestImage = loadable(() => import('./TestImage'))
const TestFeedback = loadable(() => import('./TestFeedback'))
const TestHomepage = loadable(() => import('./TestGuide'))
const TestThanks = loadable(() => import('./TestThanks'))

export {
  TestImage,
  TestFeedback,
  TestHomepage,
  TestThanks
}
