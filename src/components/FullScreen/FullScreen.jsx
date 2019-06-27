import React, { Component } from 'react'
import { Button } from 'antd'

import './style.less'


class FullScreen extends Component {

  componentDidMount() {
    this.docNsts = this.refs.nsts
    this.fullScreenType = ['webkitRequestFullScreen', 'webkitCancelFullScreen']
    window.addEventListener('resize', this.checkFullScreenClose, false)
  }
  checkFullScreenClose = () => {
    if (!this.checkFull()) {
      this.closeFullScreen()
    }
  }
  openFullScreen() {
    this.docNsts[this.fullScreenType[0]]()
  }
  closeFullScreen = (type='esc') => {
    this.props.onCloseFullScreen(type)
    document[this.fullScreenType[1]]()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.checkFullScreenClose, false)
  }
  checkFull() {
    let isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
    if (isFull === undefined) {
      isFull = false
    }
    return isFull
  }
  render() {
    return (
      <div id="fullscreen" ref="nsts">
        {
          this.props.isFull &&
          <div id="nsts">
            <Button onClick={this.closeFullScreen.bind(this, 'click')} id="btn-close" type="danger" shape="circle" icon="close" size="small"></Button>
            <iframe id="myframe" className="nsts-wrapper" src={this.props.src} frameBorder="0" allowFullScreen={true} title="imagefullscreen"></iframe>
          </div>
        }
      </div>
    )
  }
}

export default FullScreen
