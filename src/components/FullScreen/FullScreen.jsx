import React, { Component } from 'react'
import { Button } from 'antd'
import './style.less'

class FullScreen extends Component {

  componentDidMount () {
    this.docNsts = this.refs.nsts
    this.fullScreenType = ['webkitRequestFullScreen', 'webkitCancelFullScreen']
  }
  openFullScreen () {
    this.docNsts[this.fullScreenType[0]]()
  }
  closeFullScreen = () => {
    this.props.onCloseFullScreen()
    document[this.fullScreenType[1]]()
  }
  render () {
    return (
      <div id="fullscreen" ref="nsts">
        {
          this.props.isFull &&
          <div id="nsts">
            <Button onClick={this.closeFullScreen} id="btn-close" type="danger" shape="circle" icon="close" size="small"></Button>
            <iframe id="myframe" className="nsts-wrapper" src={this.props.src} frameBorder="0" allowFullScreen={true} title="imagefullscreen"></iframe>
          </div>
        }
      </div>
    )
  }
}

export default FullScreen
