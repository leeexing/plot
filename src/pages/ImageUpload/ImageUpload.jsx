import React, { Component } from 'react'
import { Alert} from 'antd'
import { inject, observer } from 'mobx-react'


@inject('appStore')
@observer
class ImageUpload extends Component {

  componentDidMount () {
    this.props.appStore.uploaderChange2Imagepage()
  }

  componentWillUnmount () {
    this.props.appStore.toggleUploaderGlobal(true)
    this.props.appStore.toggleUploaderMini(true)
  }

  render () {
    return (
      <div className="m-image-upload">
        <Alert message="请上传zip格式的打包文件" type="info" showIcon closable />
      </div>
    )
  }
}

export default ImageUpload
