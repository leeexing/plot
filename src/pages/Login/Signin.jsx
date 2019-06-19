import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd'
import { inject, observer } from 'mobx-react'

import Auth from '@/util/auth'
import api from '@/api'
import logo from '@/assets/login_bg.png'
import login_bgi from '@/assets/login_bgi.png'
import login_title from '@/assets/login_title.png'
import './style.less'

const FormItem = Form.Item

@inject('userStore')
@observer
class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        api.loginByNuctech(values).then(res => {
          console.log(res)
          if (res.result) {
            let expires = res.data.expires_in / (60 * 60 * 24)
            Auth.setToken(res.data.accessToken, expires)
            this.props.userStore.login(res.data)
            this.props.history.push('/home')
          }
        }).catch(console.log)
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="app-login app-signin" style={{backgroundImage: `url(${logo})`}}>
        <div className="app-login-wrap" style={{backgroundImage: `url(${login_bgi})`}}>
          <div className="app-login-form">
            <div className="app-login-header" style={{backgroundImage: `url(${login_title})`}}></div>
            <div className="app-login-header-sub">安全检查标注平台</div>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <FormItem
                label="账号"
              >
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入您的安培云账号' }],
                })(
                  <Input prefix={<Icon type="user" style={{ color: '#1890ff' }} />} placeholder="请输入安培云账号" />
                )}
              </FormItem>
              <FormItem
                label="密码"
              >
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入账号密码' }],
                })(
                  <Input prefix={<Icon type="lock" style={{ color: '#1890ff' }} />} type="password" placeholder="请输入账号密码" />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" shape="round" htmlType="submit" className="login-form-button">登录</Button>
              </FormItem>
            </Form>
            {/* <div className="third-part">
              第三方登录:
              <Icon type="slack" theme="outlined" />
            </div> */}
          </div>
        </div>
      </div>
    )
  }
}

export default  Form.create()(Login)
