import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import { inject, observer } from 'mobx-react'
import { pick } from 'ramda'
import Auth from '@/util/auth'
import api from '@/api'
import './style.less'

const FormItem = Form.Item

@inject('userStore')
@observer
class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        api.loginByThirdpart(values).then(res => {
          console.log(res)
          if (res.result) {
            Auth.setToken(res.data.accessToken)
            Auth.setToken(pick(['userName', 'userID', 'userType', 'nickName'], res.data), 'userInfo')
            this.props.userStore.login(res.data)
            this.props.history.push('/')
          }
        }).catch(console.log)
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="app-login">
        <div className="app-login-wrap">
          <h1 className="app-login-header">源数据管理平台</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem
              label="账号"
            >
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱/手机号/用户名" />
              )}
            </FormItem>
            <FormItem
              label="密码"
            >
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>下次自动登录</Checkbox>
              )}
              {/* <a className="login-form-forgot" href="/">忘记密码了</a> */}
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </FormItem>
          </Form>
          <div className="third-part">
            第三方登录:
            <Icon type="wechat" theme="outlined" />
            <Icon type="slack" theme="outlined" />
          </div>
        </div>
      </div>
    )
  }
}

export default  Form.create()(Login)
