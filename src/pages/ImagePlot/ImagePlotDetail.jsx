import React, { Component } from 'react'
import { Card } from 'antd'
import api from '@/api'

class ImagePlotDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      imageData: null,
      drInstance: null
    }
  }
  componentDidMount () {
    console.log(this.props)
    let id = this.props.match.params.imageId
    api.fetchImageDetail(id).then(res => {
      console.log(res)
      this.setState({
        imageData: res.data
      })
      this.renderImage(res.data)
    }).catch(console.log)
  }
  getRenderOptions () {
    let DrWidth = Math.floor(document.querySelector('.dr-canvas').offsetWidth)
    let DrHeight = Math.floor(document.querySelector('.dr-canvas').offsetHeight)
    console.log(DrWidth, DrHeight)
    let loadedCallback = () => (this.loading = false)
    let options = {DrWidth, DrHeight, loadedCallback}
    return options
  }
  renderImage (renderData) {
    this.setState({
      drInstance: new DrViewer(this.getRenderOptions())
    })
    this.state.drInstance.showDR(renderData)
  }
  render () {
    return (
      <div className="image-plot-detail">
        <Card style={{ width: 600 }}>
          <div className="image-plot-wrap">
            <div className="dr-canvas">
              <div className="dr-angles j-angles"></div>
              <div id="canvasdr"></div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
}

export default ImagePlotDetail
