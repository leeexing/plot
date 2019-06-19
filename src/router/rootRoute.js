import { Login, Signin } from 'pages/Login'

export default {
  path: '',
  children: [
    {path: 'login', component: Signin},
    {path: 'signin', component: Login},
  ]
}