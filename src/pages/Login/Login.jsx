import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import './style.less'

const FormItem = Form.Item

class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
      console.log(
        this.props
      )
      // store.dispatch({type: 'LOGIN'})
      // this.props.history.push('/')
    })
  }
  componentDidMount () {
    // console.log(store.getState())
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
              <a className="login-form-forgot" href="/">忘记密码了</a>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </FormItem>
          </Form>
          <div className="third-part">
            第三方登录:
            <Icon type="wechat" theme="outlined" />
            <Icon type="weibo" theme="outlined" />
          </div>
        </div>
      </div>
    )
  }
}

export default  Form.create()(Login)
