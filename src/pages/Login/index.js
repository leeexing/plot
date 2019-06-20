// import Login from "./Login"
// import Signin from "./Signin"
import loadable from '@loadable/component'

const Login = loadable(() => import('./Login'))
const Signin = loadable(() => import('./Signin'))

export  {
  Login,
  Signin
}
