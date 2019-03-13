import React, { Component } from 'react'
import { Button, Breadcrumb, Icon } from 'antd'
import './style.less'

const imageData = require('./data.json').package.images

class ImageMobileTest extends Component {
  constructor (props) {
    super(props)
    this.state = {
      imageData,
      drInstance: null,
      index: 0
    }
  }
  componentDidMount () {
    console.log(this.props)
    setTimeout(() => {
      this.setState({
        drInstance: new DrViewer(this.getRenderOptions())
      }, () => {
        this.showDR()
      })
    }, 100)
  }
  componentWillUnmount () {
    this.state.drInstance.stopRender()
  }

  getRenderOptions () {
    let DrWidth = Math.floor(document.querySelector('.dr-canvas').offsetWidth)
    let DrHeight = Math.floor(document.querySelector('.dr-canvas').offsetHeight)
    console.log(DrWidth, DrHeight)
    let loadedCallback = () => (this.loading = false)
    let options = {DrWidth, DrHeight, loadedCallback}
    return options
  }
  showDR () {
    this.state.drInstance.showDR(this.state.imageData[this.state.index])
  }
  onHandleFeedback = () => {
    this.props.history.push('/test/feedback')
  }
  render () {
    return (
      <div className="m-test">
        <div className="image-header">
          <Breadcrumb>
            <Breadcrumb.Item href="/test">
              <Icon type="home" />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Icon type="picture" />
              <span>图像查看</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="image-wrap">
          <div className="dr-canvas">
            <div className="dr-angles j-angles"></div>
            <div id="canvasdr"></div>
          </div>
        </div>
        <div className="image-footer">
          <div className="image-opr">
            <span className="btn bw"></span>
            <span className="btn color"></span>
            <span className="btn ms"></span>
            <span className="btn os"></span>
            <span className="btn inverse"></span>
            <span className="btn gen"></span>
            <span className="btn absorbp"></span>
            <span className="btn absorbm"></span>
          </div>
          <div className="image-feedback">
            <Button type="primary" onClick={this.onHandleFeedback}>去填写反馈意见</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default ImageMobileTest
