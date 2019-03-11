import React, { Component } from 'react'
import { Alert, Button } from 'antd'
import { inject, observer } from 'mobx-react'
import { CSSTransition } from 'react-transition-group'


@inject('appStore')
@observer
class ImageUpload extends Component {

  state = {
    flag: true
  }

  onClick = () => {
    this.setState({
      flag: !this.state.flag
    })
  }

  onEnter = () => console.log(798)

  render () {
    return (
      <div className="m-image-upload">
        <Alert message="请上传zip格式的打包文件" type="info" showIcon closable />
        <Button onClick={this.onClick}>测试</Button>
        <CSSTransition
          in={this.state.flag}
          timeout={5000}
          classNames="fade"
        >
        {
          <Alert message="特茹发电" type="info" showIcon closable />
          // () => {
          //   return this.state.flag ? <Alert message="特茹发电" type="info" showIcon closable /> : <div></div>
          // }
        }
        </CSSTransition>
      </div>
    )
  }
}

export default ImageUpload
