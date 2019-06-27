import React, { Component } from 'react'
import { Button, Breadcrumb, Icon } from 'antd'

import './style.less'

const imageData = require('./data.json').package.images


class ImageMobileTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageData,
      drInstance: null,
      index: 0,
      shaderC: 'default',
      shaderB: 'standard',
      absorbValue: 0
    }
  }
  componentDidMount() {
    console.log(this.props)
    setTimeout(() => {
      this.drInstance = new DrViewer(this.getRenderOptions())
      this.showDR()
    }, 100)

    this.canvasdrDom = document.getElementById('canvasdr')
    touch.on(this.canvasdrDom, 'touchstart', this.onhandleTouchStart)
    touch.on(this.canvasdrDom, 'pinch', this.onhandlePinch)
  }
  componentWillUnmount() {
    this.drInstance.stopRender()
    touch.off(this.canvasdrDom, 'touchstart', null)
    touch.off(this.canvasdrDom, 'pinch', null)
  }

  onhandleTouchStart = () => {
    this.initZoom = this.drInstance.drinstance.getZoomIndex().toFixed(2)
  }

  onhandlePinch = ev => {
    let scale = 1 + (ev.scale - 1) * 0.3 // *0.3 是为了降低放大的灵敏度
    if (this.drInstance) {
      let zoom = (this.initZoom * scale.toFixed(2)).toFixed(2)
      zoom > 16 && (zoom = 16)
      zoom < 0 && (zoom = 0)
      this.drInstance.drinstance.setZoomIndex(zoom)
    }
  }

  getRenderOptions() {
    let DrWidth = Math.floor(document.querySelector('.dr-canvas').offsetWidth)
    let DrHeight = Math.floor(document.querySelector('.dr-canvas').offsetHeight)
    console.log(DrWidth, DrHeight)
    let loadedCallback = () => (this.loading = false)
    let options = {DrWidth, DrHeight, loadedCallback, cached: false} // 不开启本地存储
    return options
  }

  showDR() {
    if (this.drInstance.hasLoaded) {
      this.drInstance.showDR(this.state.imageData[this.state.index])
      this.setState({
        shaderB: 'standard',
        shaderC: 'default',
        absorbValue: 0
      })
    }
  }

  swapImage = () => {
    let index = Math.floor(Math.random() * imageData.length)
    this.setState({index}, () => {
      this.showDR()
    })
  }

  onHandleFeedback = () => {
    this.props.history.push('/mobile/feedback')
  }

  renderGray = () => {
    this.setState({
      shaderC: 'blackwhite'
    })
    this.drInstance.shaderC = 'blackwhite'
    this.drInstance.setShader()
  }

  renderColor = () => {
    this.setState({
      shaderC: 'default'
    })
    this.drInstance.shaderC = 'default'
    this.drInstance.setShader()
  }

  renderOs = () => {
    this.setState({
      shaderC: 'os'
    })
    this.drInstance.shaderC = 'os'
    this.drInstance.setShader()
  }

  renderMs = () => {
    this.setState({
      shaderC: 'ms'
    })
    this.drInstance.shaderC = 'ms'
    this.drInstance.setShader()
  }

  renderGen = () => {
    let shaderB = this.state.shaderB === 'standard' ? 'superpenetrate' : 'standard'
    this.setState({shaderB})
    this.drInstance.shaderB = shaderB
    this.drInstance.setShader()
  }

  absorbPlus = () => {
    let absorbValue = Math.min(25, (this.state.absorbValue + 5))
    this.drInstance.absorbValue = absorbValue
    this.drInstance.drinstance.setAbsorbLUT(65000, absorbValue)
    this.setState({absorbValue})
  }

  absorbMinus = () => {
    let absorbValue = Math.max(-25, (this.state.absorbValue - 5))
    this.drInstance.absorbValue = absorbValue
    this.drInstance.drinstance.setAbsorbLUT(65000, absorbValue)
    this.setState({absorbValue})
  }

  reset = () => {
    this.setState({
      shaderB: 'standard',
      shaderC: 'default',
      absorbValue: 0
    })
    this.drInstance.resetDR()
  }

  render() {
    let { shaderB, shaderC, absorbValue } = this.state
    return (
      <div className="m-test">
        <div className="image-header">
          <Breadcrumb>
            <Breadcrumb.Item href="/test">
              <Icon type="home" />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Icon type="picture" />
              <span>图像测试</span>
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
          <div className="image-swap" onClick={this.swapImage}>
            <Icon type="swap" />
          </div>
          <div className="image-opr">
            <span onClick={this.renderGray} className={shaderC === 'blackwhite' ? 'btn bw active' : 'btn bw'}></span>
            <span onClick={this.renderColor} className={shaderC === 'default' ? 'btn color active' : 'btn color'}></span>
            <span onClick={this.renderMs} className={shaderC === 'ms' ? 'btn ms active' : 'btn ms'}></span>
            <span onClick={this.renderOs} className={shaderC === 'os' ? 'btn os active' : 'btn os'}></span>
            <span onClick={this.absorbPlus} className={absorbValue > 0 ? 'btn absorbp active' : 'btn absorbp'}></span>
            <span onClick={this.absorbMinus} className={absorbValue < 0 ? 'btn absorbm active' : 'btn absorbm'}></span>
            <span onClick={this.renderGen} className={shaderB === 'superpenetrate' ? 'btn gen active' : 'btn gen'}></span>
            <span className="btn reset" onClick={this.reset}></span>
          </div>
          <div className="image-feedback">
            <Button type="primary" onClick={this.onHandleFeedback}>填写反馈问题</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default ImageMobileTest
