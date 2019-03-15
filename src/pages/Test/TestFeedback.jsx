import React, { Component } from 'react'
import { Breadcrumb, Button, Icon, Form, Input, message } from 'antd'
import axios from 'axios'


const http = axios.create({
  // baseURL: 'http://localhost:5282',
  baseURL: 'http://132.232.18.77:5282',
  timeout: 3000,
})
const { TextArea } = Input


class Feedback extends Component {
  state = {
    hasProblem: false
  }

  componentDidMount () {
    document.addEventListener('touchstart', function (event) {
      if (event.touches.length > 1 && event.scale !== 1) {
        event.preventDefault()
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        const userAgent = window.navigator.userAgent
        const createTime = new Date()
        let postData = {...values, userAgent, createTime}
        http.post('/api/test/image', postData)
          .then(res => res.data)
          .then(res => {
            if (res.result) {
              message.success('您的反馈已提交！')
              this.props.form.resetFields()
              this.props.history.push('/test/thanks')
            } else {
              message.success('提交出了点问题')
            }
          }).catch(err => {
            console.log(err)
          })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
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
              <span>测试反馈</span>
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
            <Form.Item label="手机品牌及型号">
              {getFieldDecorator('brand', {
                rules: [{ required: true, message: '请输入手机品牌及型号!' }],
              })(
                <Input type="text" placeholder="请输入手机品牌及型号，例如：华为mate9" />
              )}
            </Form.Item>
            {/* <Form.Item label="手机型号">
              {getFieldDecorator('model', {
                  rules: [{ required: true, message: '请输入您使用的手机型号!' }],
                })(
                  <Input type="text" placeholder="请输入手机型号" />
                )}
            </Form.Item> */}
            <Form.Item label="系统版本">
              {getFieldDecorator('version', {})(
                  <Input type="text" placeholder="请输入手机系统版本，例如：12.14" />
                )}
            </Form.Item>
            <Form.Item label="问题描述">
              {getFieldDecorator('question', {
                  rules: [{ required: true, message: '请输入您的反馈信息' }],
                })(
                  <TextArea type="text" placeholder='请您详细描述测试中图像产生的问题以及提出建议，以便我们做出更好的优化和改进' autosize={{ minRows: 3, maxRows: 6 }} />
                )}
            </Form.Item>
            <Form.Item style={{textAlign: "center"}}>
              <Button type="primary" htmlType="submit" className="login-form-button">
                提交反馈
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create({ name: 'feedback' })(Feedback)
