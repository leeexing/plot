import React, { Component } from 'react'
import { Icon } from 'antd'


class Feedback extends Component {
  onHandleBack = () => {
    this.props.history.go(-1)
  }
  render () {
    return (
      <div className="m-test-feedback">
        <div className="header" onClick={this.onHandleBack}>
          <Icon  type="left"/>
          返回
        </div>
        反馈表单
      </div>
    )
  }
}

export default Feedback
