import React, { Component } from 'react'
import { Avatar, Button, Badge, Icon, Input, Pagination, Tooltip, Skeleton, message } from 'antd'

import FullScreen from 'components/FullScreen'
import { PackIcon, PlotIcon, PlotedIcon } from '@/icon'
import api from '@/api'
import './style.less'


class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDataLoaded: false,
      imageList: [],
      currentPage: 1,
      total: 0,
      isFull: false,
      src: '',
      tag: '',
      wantToDownload: false,
      selectedImageIds: new Set(),
      selectedImageCount: 0,
    }
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData () {
    let { batchId } = this.props.match.params
    let data = {
      page: this.state.currentPage,
      limit: 20,
    }
    // -其他请求获取图像标记列表
    api.fetchPlotUploadBatchDetail(batchId, data).then(res => {
      console.log(res)
      if (res.result) {
        this.setState({
          imageList: res.data.images,
          total: res.data.count
        })
      }
    }).catch(console.log)
  }

  onChange = (pageNumber) => {
    console.log('Page: ', pageNumber)
  }

  onhandleTag = (e) => {
    this.setState({
      tag: e.target.value
    })
  }

  onHandleWantToDownload = () => {
    this.setState({
      wantToDownload: true
    })
  }

  onHandleSelectAll = (value=true) => {
    let imageList = this.state.imageList.slice()
    imageList.map(item => {
      item.isSelected = value ? true : !item.isSelected
      item.isSelected ? this.state.selectedImageIds.add(item._id) : this.state.selectedImageIds.delete(item._id)
      return item
    })
    this.setState({
      imageList,
      selectedImageCount: this.state.selectedImageIds.size
    })
  }

  onHandleDownload (isPack = true)  {
    if (isPack) {
      console.log([...this.state.selectedImageIds])
      let data = {
        packIds: [...this.state.selectedImageIds],
        tag: this.state.tag.trim()
      }
      api.packPlotImages(data).then(res => {
        if (res.result) {
          console.log(res)
          message.success('图像打包成功')
        }
      }).catch(err => {
        message.error(err)
      })
      .finally(() => {
        this.resetDownloadStatus()
      })
    } else {
      this.resetDownloadStatus()
    }
  }

  resetDownloadStatus () {
    let imageList = this.state.imageList.slice()
    imageList.forEach(item => item.isSelected = false)
    this.setState({
      wantToDownload: false,
      selectedImageIds: new Set(),
      selectedImageCount: 0,
      tag: '',
      imageList
    })
  }

  onHandleSelect (item, index, value) {
    if (value) {
      this.state.selectedImageIds.add(item._id)
    } else {
      this.state.selectedImageIds.delete(item._id)
    }
    let imageList = this.state.imageList.slice()
    imageList[index].isSelected = value
    this.setState({
      imageList,
      selectedImageCount: this.state.selectedImageIds.size
    })
  }

  plotImage (item) {
    let { batchId } = this.props.match.params
    let url = `api/plot/uploads/${batchId}`
    this.setState({
      isFull: true,
      src: `/3D/DR_base.html?type=MAP_BROWSE&count=${this.state.total}&page=${this.state.currentPage}&limit=50&url=${url}&initShowId=${item._id}`
    })
    this.refs.fullScreen.openFullScreen()
  }

  closeFullScreen = (type='esc') => {
    if (type === 'esc') {
      this.setState({
        isFull: false,
        src: ''
      })
      this.fetchData()
    }
  }

  render () {
    return (
      <div className="m-plot-image">
        <div className="m-plot-download">
          {!this.state.wantToDownload
            ? <Avatar onClick={this.onHandleWantToDownload} size={64} icon="cloud-download" className="download" />
            : <React.Fragment>
                <Input onChange={this.onhandleTag} placeholder="请给该批次打包图像一个标签" style={{width: '30%'}} />
                <div className="download-btns">
                    <Button onClick={this.onHandleSelectAll.bind(this)} type="primary">全选</Button>
                    <Button onClick={this.onHandleSelectAll.bind(this, false)} type="primary" ghost>反选</Button>
                    <Button onClick={this.onHandleDownload.bind(this)} disabled={this.state.selectedImageCount === 0 } type="primary">
                      <Badge count={this.state.selectedImageCount} offset={[10, -10]}>
                        下 载
                      </Badge>
                    </Button>
                    <Button onClick={this.onHandleDownload.bind(this, false)} type="dashed">取消</Button>
                </div>
              </React.Fragment>
          }
        </div>

        {/* 标图列表 */}
        <div className="image-content">
          <ul className="image-container">
            {this.state.imageList.length < 1
              ? <Skeleton rows="8" />
              : this.state.imageList.map((item, index) => (
                  <li className="image-list" key={index}>
                    <div className="image-item">
                      <div className="image-operate">
                        <div className="image-check">
                          {
                            (this.state.wantToDownload && !item.isSelected) && <PackIcon onClick={this.onHandleSelect.bind(this, item, index, true)} />
                            // (this.state.wantToDownload && !item.isSelected) && <Icon onClick={this.onHandleSelect.bind(this, item, index, true)} type="shopping-cart"/>
                          }
                          {
                            (this.state.wantToDownload && item.isSelected) && <Icon onClick={this.onHandleSelect.bind(this, item, index, false)} type="heart" theme="twoTone" twoToneColor="#eb2f96" />
                          }
                        </div>
                        {/* <div className="image-handle">
                          <Tooltip title="全屏标图" placement="bottom">
                          {
                            !this.state.wantToDownload && <FullScreenIcon />
                          }
                          </Tooltip>
                        </div> */}
                      </div>
                      <div className="image-wrap" onClick={this.plotImage.bind(this, item)}>
                        <img className="thumbnail" src={item.thumbnails[0].url} alt="" />
                      </div>
                      <h3 className="image-name">
                        {item.name}
                        {!item.plot
                          ? <Tooltip title="标图" placement="top">
                              <PlotIcon style={{float: 'right', marginTop: '5px', color: '#aaa'}}></PlotIcon>
                            </Tooltip>
                          : <PlotIcon style={{float: 'right', marginTop: '5px', color: '#5282EF'}}></PlotIcon>
                          // : <PlotedIcon style={{float: 'right', marginTop: '5px', color: '#EF5350'}}></PlotedIcon>
                        }
                      </h3>
                    </div>
                  </li>
                ))
            }
          </ul>
        </div>

        {/* 分页 */}
        <div className="pagination">
          {this.state.imageList.length < 1
            ? null
            : <Pagination showQuickJumper defaultCurrent={this.state.currentPage}
                defaultPageSize={20}
                total={this.state.total}
                onChange={this.onChange} />
          }
        </div>

        {/* 全屏标图 */}
        <FullScreen
          ref="fullScreen"
          isFull={this.state.isFull}
          onCloseFullScreen={this.closeFullScreen}
          src={this.state.src}
        />
      </div>
    )
  }
}

export default HomePage
