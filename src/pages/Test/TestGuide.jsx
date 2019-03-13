import React from 'react'
import { Alert, Button, Steps } from 'antd'
import guidebg from '../../assets/login_bg.svg'

const Step = Steps.Step

const TestHomepage = (props) => (
  <div className="m-test-guide" style={{backgroundImage: `url(${guidebg})`}}>
    <div className="guide">
      <h1 style={{marginBottom: "15px", fontSize: "22px", color: "#666"}}>图像测试须知</h1>
      <Steps direction="vertical" size="small">
        <Step description="阅读相关测试须知，点击开始，进行图像测试" />
        <Step description="图像查看，对图像进行拖动缩放，以及点击下方的图像操作按钮，对图像进行全方位检测" />
        <Step description="完成第二步后，填写反馈表单" />
      </Steps>
      <Alert message="感谢您抽出时间帮忙测试，安培云的变好有您的一份功劳" type="info" />
      <Button type="primary" onClick={() => props.history.push('/test/image')} style={{marginTop: "15px"}}>开始测试</Button>
    </div>
  </div>
)

export default TestHomepage
