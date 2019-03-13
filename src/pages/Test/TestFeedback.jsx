import React, { Component } from 'react'
import { Breadcrumb, Button, Icon, Form, Input, Switch } from 'antd'

const { TextArea } = Input

class Feedback extends Component {
  state = {
    hasProblem: false
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }
  onChangeIsOk = value => {
    console.log(value)
    this.setState({
      hasProblem: value
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 8, style: {lineHeight:'40px'} },
      wrapperCol: { span: 8 },
    }
    return (
      <div className="m-test-feedback">
        <div className="header">
          <Breadcrumb>
            <Breadcrumb.Item href="/test">
              <Icon type="home" />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/test/image">
              <Icon type="picture" />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Icon type="form" />
              <span>表单填写</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="feedback-form">
          <Form onSubmit={this.handleSubmit} layout="horizontal">
            <Form.Item label="昵称">
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入您的昵称!' }],
              })(
                <Input type="text" placeholder="请输入您的昵称" />
                )}
            </Form.Item>
            <Form.Item label="手机品牌">
              {getFieldDecorator('brand', {
                rules: [{ required: true, message: '请输入您使用的手机品牌!' }],
              })(
                <Input type="text" placeholder="请输入手机品牌" />
              )}
            </Form.Item>
            <Form.Item label="手机型号">
              {getFieldDecorator('model', {
                  rules: [{ required: true, message: '请输入您使用的手机型号!' }],
                })(
                  <Input type="text" placeholder="请输入手机型号" />
                )}
            </Form.Item>
            <Form.Item label="系统版本">
              {getFieldDecorator('version', {})(
                  <Input type="text" placeholder="请输入手机系统版本" />
                )}
            </Form.Item>
            <Form.Item
              label="图像显示有问题"
              {...formItemLayout}
            >
              {getFieldDecorator('isOk', { valuePropName: 'checked' })(
                <Switch onChange={this.onChangeIsOk} />
              )}
            </Form.Item>
            {
              this.state.hasProblem ?
              <Form.Item label="问题描述">
                {getFieldDecorator('question', {
                    rules: [{ required: true, message: '请输入您使用时发现的问题' }],
                  })(
                    <TextArea type="text" placeholder="没有问题，请您直接恢复[完美]" autosize={{ minRows: 3, maxRows: 6 }} />
                  )}
              </Form.Item>
              : ''
            }
            <Form.Item style={{textAlign: "center"}}>
              <Button type="primary" htmlType="submit" className="login-form-button">
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create({ name: 'feedback' })(Feedback)
