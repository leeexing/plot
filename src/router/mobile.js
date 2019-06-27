import { TestHomepage, TestImage, TestFeedback, TestThanks } from 'pages/TestMobile'

export default {
  path: 'mobile',
  children: [
    { path: '/', component: TestHomepage },
    { path: 'drimage', component: TestImage },
    { path: 'feedback', component: TestFeedback },
    { path: 'thanks', component: TestThanks }
  ]
}
