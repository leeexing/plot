/**
 * 对接安培云系统跳转过来
 * 保存传递过来的路由
*/
import React from 'react'


const LoginOhter = props => {
  console.log(props)
  props.history.push('/plot')
  return (
    <div className="app-login-other"></div>
  )
}

export default LoginOhter
