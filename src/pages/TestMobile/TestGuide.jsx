import React from 'react'
import { Alert, Button, Steps, Icon } from 'antd'
import { curry } from 'ramda'

import guidebg from '@/icon/svg/login_bg.svg'
import { setProp } from '@/util'

const setColor = curry(setProp, 'color')
const Step = Steps.Step

const step1 = <div>阅读本页测试须知，确认了解后，点击<span style={setColor('red')}>【开始测试】</span>进行图像测试</div>
const step2 = <div >图像测试。对图像进行一系列图像操作按钮查看图像显示效果，点击右下方的【<Icon type="swap" style={setColor('#eb2f96')} />】可切换图像。
  若图像显示没有问题，<span style={setColor('#52c41a')}>【直接退出即可】</span>；如有问题，请点击<span style={setColor('red')}>【填写反馈问题】</span></div>
const step3 = <div>填写反馈表单。请在问题描述中详细填写图像显示过程中产生的问题，然后点击<span style={setColor('red')}>【提交反馈】</span>完成图像测试</div>

const TestHomepage = props => (
  <div className="m-test-guide" style={{ backgroundImage: `url(${guidebg})` }}>
    <div className="guide">
      <h1 style={{ marginBottom: '15px', fontSize: '22px', color: '#666' }}>图像测试须知</h1>
      <Steps direction="vertical" size="small" style={{ textAlign: 'left' }}>
        <Step description={step1} />
        <Step description={step2} />
        <Step description={step3} />
      </Steps>
      <Alert message="感谢您百忙之中抽出时间协助测试，安培云的变好有您的一份功劳" type="info" />
      <Button type="primary" onClick={() => props.history.push('/mobile/drimage')} style={{ marginTop: '15px' }}>开始测试</Button>
    </div>
  </div>
)

export default TestHomepage
