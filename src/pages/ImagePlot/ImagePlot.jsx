import React, { Component } from 'react'
import { Avatar, Button, Badge, Input, Pagination, Tooltip, Skeleton, Select, message } from 'antd'

import FullScreen from 'components/FullScreen'
import { PackIcon } from '@/icon'
import api from '@/api'
import './style.less'


class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDataLoaded: false,
      imageList: [],
      currentPage: 1,
      limit: 500,
      total: 0,
      isFull: false,
      src: '',
      tag: '',
      wantToDownload: false,
      selectedImageIds: new Set(),
      selectedImageCount: 0,
      plotStatus: 'all',
      imageName: '',
      loading: true
    }
  }

  componentDidMount () {
    this.fetchData()
    window.onmessage = msgEvent => {
      let { type, id, postData } = msgEvent.data
      if (type === 'submitPlot') {
        api.updateImgSuspect(id, JSON.parse(postData)).then(res => {}).catch(console.error)
      }
    }
  }

  fetchData () {
    let { batchId } = this.props.match.params
    let { currentPage, limit, plotStatus, imageName } = this.state
    let data = {
      page: currentPage,
      limit,
      imageName,
      plotStatus
    }
    this.setState({
      loading: true
    })
    // -其他请求获取图像标记列表
    api.fetchPlotUploadBatchDetail(batchId, data).then(res => {
      if (res.result) {
        this.setState({
          imageList: res.data.images,
          total: res.data.count,
          loading: false
        })
      }
    }).catch(console.log)
  }

  handleSelectChange = value => {
    this.setState({
      plotStatus: value
    }, this.fetchData)
  }

  search = value => {
    this.setState({
      imageName: value.trim()
    }, this.fetchData)
  }

  handlePageChange = currentPage => {
    this.setState({
      currentPage
    })
  }

  onhandleTag = e => {
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
      item.isSelected ? this.state.selectedImageIds.add(item.id) : this.state.selectedImageIds.delete(item.id)
      return item
    })
    this.setState({
      imageList,
      selectedImageCount: this.state.selectedImageIds.size
    })
  }

  onHandleDownload (isPack = true)  {
    if (!isPack) {
      this.resetDownloadStatus()
      return
    }
    let data = {
      packIds: [...this.state.selectedImageIds],
      tag: this.state.tag.trim()
    }
    if (!this.state.tag.trim()) {
      return message.warn('标签名不能为空')
    }
    api.packPlotImages(data).then(res => {
      if (res.result) {
        message.success('图像打包成功!')
      }
    }).catch(err => {
      message.error(err)
    })
    .finally(() => {
      this.resetDownloadStatus()
    })
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
      this.state.selectedImageIds.add(item.id)
    } else {
      this.state.selectedImageIds.delete(item.id)
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
    let { imageName, plotStatus, total, currentPage } = this.state
    let url = `api/upload/${batchId}`
    this.setState({
      isFull: true,
      src: `/3D/DR_base.html?type=MAP_BROWSE
          &count=${total}
          &page=${Math.ceil(currentPage * 20 / 40)}
          &limit=40&url=${url}
          &initShowId=${item.id}
          &imageName=${encodeURI(imageName)}
          &plotStatus=${plotStatus}`.replace(/\s+/g, '')
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
    let { currentPage, total } = this.state
    let imageList = this.state.imageList.slice((currentPage - 1) * 20, currentPage * 20)
    return (
      <div className="m-plot-image">
        {/* 查询、筛选、打包 */}
        <div className="m-plot-header">
          <div className="m-plot-search">
            <Input.Search
              style={{ width: '65%' }}
              allowClear
              enterButton
              placeholder="请输入图像名称"
              onPressEnter={e => this.search(e.target.value)}
              onSearch={this.search}
            />
            <Select
              style={{ width: '30%' }}
              placeholder="标图状态"
              defaultValue="全部"
              onChange={this.handleSelectChange}
            >
              <Select.Option value="all" label="全部">
                全部
              </Select.Option>
              <Select.Option value="unplot" label="未标图">
                未标图
              </Select.Option>
              <Select.Option value="ploted" label="已标图">
                已标图
              </Select.Option>
            </Select>
          </div>
          <div className="m-plot-download">
            {!this.state.wantToDownload
              ? <Avatar onClick={this.onHandleWantToDownload} size={64} icon="cloud-download" className="download" />
              : <React.Fragment>
                  <Input onChange={this.onhandleTag} placeholder="请输入此次下载的标签名" style={{width: '35%'}} />
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
        </div>

        {/* 标图列表 */}
        <div className="image-content">
          <ul className="image-container">
            {this.state.imageList.length < 1
              ? <Skeleton loading={this.state.loading} rows="8">
                <p className="no-match">暂无结果~</p>
              </Skeleton>
              : imageList.map((item, index) => (
                  <li className="image-list" key={index}>
                    <div className="image-item">
                      <div className="image-operate">
                        <div className="image-check">
                          {
                            (this.state.wantToDownload && !item.isSelected) && <PackIcon onClick={this.onHandleSelect.bind(this, item, index, true)} />
                            // (this.state.wantToDownload && !item.isSelected) && <Icon onClick={this.onHandleSelect.bind(this, item, index, true)} type="shopping-cart"/>
                          }
                          {
                            (this.state.wantToDownload && item.isSelected) && <PackIcon onClick={this.onHandleSelect.bind(this, item, index, false)} style={{color: "#eb2f96"}} />
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
                        <img className="thumbnail" src={item.thumbnails.length > 0 ? item.thumbnails[0].url : item.dr[0].url} alt="" />
                      </div>
                      <div className="image-name">
                        <h3>
                          {item.name.length > 10
                            ? <Tooltip title={item.name} placement="top">
                              {item.name.slice(0, 10) + '...'}
                            </Tooltip>
                            : item.name
                          }
                        </h3>
                        {item.plot ? <div className="plot-status ploted">已标</div> : <div className="plot-status unplot">未标</div>}
                        {/* {!item.plot
                          ? <Tooltip title="标图" placement="top">
                              <PlotIcon style={{float: 'right', marginTop: '5px', color: '#aaa'}}></PlotIcon>
                            </Tooltip>
                          : <PlotIcon style={{float: 'right', marginTop: '5px', color: '#5282EF'}}></PlotIcon>
                        } */}
                      </div>
                    </div>
                  </li>
                ))
            }
          </ul>
        </div>

        {/* 分页 */}
        <div className="pagination">
          {this.state.imageList.length > 0
            && <Pagination
                showQuickJumper
                defaultCurrent={currentPage}
                total={total}
                pageSize={20}
                showTotal={total => `总共 ${total} 张`}
                onChange={this.handlePageChange} />
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
