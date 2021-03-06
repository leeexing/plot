import React, { Component } from 'react'
import { Avatar, Button, Badge, Input, Icon, Modal,
  Pagination, Tooltip, Skeleton, Select, message } from 'antd'
import QueueAnim from 'rc-queue-anim'

import './style.less'
import api from '@/api'
import { PackIcon } from '@/icon'
import FullScreen from 'components/FullScreen'


class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDataLoaded: false,
      imageList: [],
      currentPage: 1,
      pageSize: 20,
      limit: 10000,
      total: 0,
      isFull: false,
      src: '',
      tag: '',
      wantToDownload: false,
      selectedImageIds: new Set(),
      selectedImageCount: 0,
      plotStatus: 'all',
      renameModal: false,
      imageName: '',
      imageNewName: '',
      renameImageId: null,
      loading: true
    }
  }

  componentDidMount() {
    this.fullScreenDOM = document.getElementById('fullscreen')
    this.fetchData()
    window.onmessage = msgEvent => {
      let { type, id, postData } = msgEvent.data
      if (type === 'submitPlot') {
        api.updateImgSuspect(id, JSON.parse(postData)).then(res => {
          this.fetchData()
        }).catch(console.error)
      }
    }
  }

  fetchData(updatePageNum=false) {
    let { batchId } = this.props.match.params
    let { limit, plotStatus, imageName } = this.state
    let data = {
      page: 1,
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
        let updateData = {
          imageList: res.data.images,
          total: res.data.count,
          loading: false
        }
        if (updatePageNum) {
          updateData.currentPage = 1
        }
        this.setState(updateData)
      }
    }).catch(console.log)
  }

  handlePlotStatusChange = value => {
    this.setState({
      plotStatus: value
    }, this.fetchData.bind(this, true))
  }

  search = value => {
    this.setState({
      imageName: value.trim()
    }, this.fetchData.bind(this, true))
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

  onHandleSelectAll = (value = true) => {
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

  onHandleDownload(isPack = true)  {
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
        message.success('图像开始打包中...')
      }
    }).catch(err => {
      message.error(err)
    })
    .finally(() => {
      this.resetDownloadStatus()
    })
  }

  resetDownloadStatus() {
    let imageList = this.state.imageList.slice()
    imageList.forEach(item => item.isSelected = false)
    this.setState({
      imageList,
      wantToDownload: false,
      selectedImageIds: new Set(),
      selectedImageCount: 0,
      tag: ''
    })
  }

  onHandleSelect(item, index, value) {
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

  plotImage(item, index) {
    if (this.state.wantToDownload) {
      return item.isSelected ? this.onHandleSelect(item, index, false) : this.onHandleSelect(item, index, true)
    }
    let { batchId } = this.props.match.params
    let { imageName, plotStatus, total, currentPage, pageSize } = this.state
    let url = `api/upload/${batchId}`
    this.setState({
      isFull: true,
      src: `/3D/DR_base.html?type=MAP_BROWSE
          &count=${total}
          &page=${currentPage}
          &limit=${pageSize}&url=${url}
          &initShowId=${item.id}
          &imageName=${encodeURI(imageName)}
          &plotStatus=${plotStatus}`.replace(/\s+/g, '')
    })
    this.fullScreenDOM['webkitRequestFullScreen']()
  }

  toggleShowRenameInput(item, index = -1) {
    if (index !== -1) {
      this.setState({
        imageName: item.name,
        renameImageId: item.id,
        renameModal: true
      })
    } else {
      this.setState({
        renameModal: false
      })
    }
  }

  handleImageNewName(e) {
    this.setState({
      imageNewName: e.target.value.trim()
    })
  }

  imageRenameSubmit = () => {
    if (this.state.imageNewName.length === 0) {
      message.warning('图像名称不能为空！')
      return
    }
    let putData = {
      newName: this.state.imageNewName
    }
    api.renameImage(this.state.renameImageId, putData).then(res => {
      if (res.result) {
        this.setState({
          imageName: '',
          imageNewName: '',
          renameImageId: null,
          renameModal: false
        }, () => {
          message.success('图像名称修改成功！')
          this.fetchData()
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  closeFullScreen = (type = 'esc') => {
    if (type === 'esc') {
      this.setState({
        isFull: false,
        src: ''
      })
      this.fetchData()
    }
  }

  render() {
    let { currentPage, total, pageSize, imageName, imageNewName } = this.state
    let imageList = this.state.imageList.slice((currentPage - 1) * pageSize, currentPage * pageSize)

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
              onChange={this.handlePlotStatusChange}
            >
              <Select.Option value="all" label="全部">全部</Select.Option>
              <Select.Option value="unplot" label="未标图">未标图</Select.Option>
              <Select.Option value="ploted" label="已标图">已标图</Select.Option>
            </Select>
          </div>
          <div className="m-plot-download">
            {!this.state.wantToDownload
              ? <Avatar onClick={this.onHandleWantToDownload} size={64} icon="cloud-download" className="download" />
              : <React.Fragment>
                  <Input onChange={this.onhandleTag} placeholder="请输入此次下载的标签名" style={{ width: '35%' }} />
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
              : <QueueAnim delay={100} type="top">
                {
                  imageList.map((item, index) => (
                    <li className="image-list" key={index}>
                      <div className="image-item">
                        <div className="image-operate">
                          <div className="image-check">
                            {this.state.wantToDownload
                              ? item.isSelected
                                ? <PackIcon onClick={this.onHandleSelect.bind(this, item, index, false)} style={{ color: '#eb2f96' }} />
                                : <PackIcon onClick={this.onHandleSelect.bind(this, item, index, true)} />
                              : null
                            }
                          </div>
                        </div>
                        <div className="image-wrap" onClick={this.plotImage.bind(this, item, index)}>
                          <img className="thumbnail" src={item.thumbnails.length > 0 ? item.thumbnails[0].url : item.dr[0].url} alt="" />
                        </div>
                        <div className="image-name">
                          {/* {
                            renameIndex === index
                            ? <div style={{ display: 'flex' }}>
                              <Input value={item.name} size="small" onChange={e => this.handleImageNewName(e)}></Input>
                              <Button.Group style={{ display: 'flex' }}>
                                <Button onClick={() => this.toggleShowRenameInput(-1)} size="small" style={{ fontSize: '12px'}}>取消</Button>
                                <Button onClick={() => this.imageRenameSubmit(item)} size="small" style={{ fontSize: '12px'}}>确定</Button>
                              </Button.Group>
                            </div>
                            : <React.Fragment>
                                <h3>
                                    {item.name.length > 10
                                      ? <Tooltip title={item.name} placement="top">
                                          {item.name.slice(0, 10) + '...'}
                                        </Tooltip>
                                      : item.name
                                    }
                                    <Icon onClick={() => this.toggleShowRenameInput(index)} style={{ marginLeft: '3px', cursor: 'pointer' }} type="edit" />
                                  </h3>
                                {item.plot ? <div className="plot-status ploted">已标</div> : <div className="plot-status unplot">未标</div>}
                            </React.Fragment>
                          } */}
                          <div className="image-name-detail">
                            <h3>
                              {item.name.length > 15
                                ? <Tooltip title={item.name} placement="top">
                                    {item.name.slice(0, 15) + '...'}
                                  </Tooltip>
                                : item.name
                              }
                            </h3>
                            <Icon onClick={() => this.toggleShowRenameInput(item, index)} style={{ marginLeft: '5px', cursor: 'pointer' }} type="edit" />
                          </div>
                          {item.plot ? <div className="plot-status ploted">已标</div> : <div className="plot-status unplot">未标</div>}
                        </div>
                      </div>
                    </li>
                  ))
                }
              </QueueAnim>
            }
          </ul>
        </div>

        {/* 分页 */}
        <div className="pagination">
          {this.state.imageList.length > 0
            && <Pagination
                showQuickJumper
                total={total}
                current={currentPage}
                pageSize={pageSize}
                showTotal={total => `总共 ${total} 张`}
                onChange={this.handlePageChange}
              />
          }
        </div>

        {/* 全屏标图 */}
        <FullScreen
          isFull={this.state.isFull}
          onCloseFullScreen={this.closeFullScreen}
          src={this.state.src}
        />

        {/* 图像重命名 */}
        <Modal
          title="图像重命名"
          visible={this.state.renameModal}
          okText="确定"
          cancelText="取消"
          onOk={this.imageRenameSubmit}
          onCancel={() => this.toggleShowRenameInput(null, -1)}
        >
          <p>原图像名称：{imageName}</p>
          <Input value={imageNewName} onChange={e => this.handleImageNewName(e)} placeholder="请输入图像新名称"></Input>
        </Modal>
      </div>
    )
  }
}

export default HomePage
