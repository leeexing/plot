import {TestHomepage, TestImage, Feedback, TestThanks } from 'pages/Test'

export default {
  path: 'mobile',
  children: [
    {path: '/', component: TestHomepage},
    {path: 'drimage', component: TestImage},
    {path: 'feedback', component: Feedback},
    {path: 'thanks', component: TestThanks},
  ]
}