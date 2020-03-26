import React, { Component } from 'react'
import {
  Avatar,
  Button,
  Badge,
  Input,
  Icon,
  Modal,
  Form,
  TreeSelect,
  Pagination,
  Tooltip,
  Skeleton,
  Select,
  message
} from 'antd'
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
      loading: true,
      kpValue: [],
      treeData: []
    }
  }

  componentDidMount() {
    this.fullScreenDOM = document.getElementById('fullscreen')
    this.fetchData()
    this.fetchImgKp()
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

  fetchImgKp () {
    this.setState({
      treeData: [
        {
          title: '禁止随身和托运',
          value: 'A',
          key: 'A',
          children: [
            {
              title: '枪支等武器（包括主要零部件）',
              value: 'A1',
              key: 'A1',
            },
            {
              title: '爆炸或者燃烧物质和装置',
              value: 'A2',
              key: 'A2',
            },
            {
              title: '危险物品',
              value: 'A3',
              key: 'A3',
            },
            {
              title: '管制器具',
              value: 'A4',
              key: 'A4',
            },
            {
              title: '其他物品',
              value: 'A5',
              key: 'A5',
            },
          ],
        },
        {
          title: '禁止随身但可托运',
          value: 'B',
          key: 'B',
          children: [
            {
              title: '锐气',
              value: 'B1',
              key: 'B1',
            },
            {
              title: '钝器',
              value: 'B2',
              key: 'B2',
            },
            {
              title: '工具',
              value: 'B3',
              key: 'B3',
            },
            {
              title: '其他',
              value: 'B4',
              key: 'B4',
            },
          ],
        },
        {
          title: '限制随身但可托运',
          value: 'C',
          key: 'C',
          children: [
            {
              title: '化妆品、洗漱类生活液态物品',
              value: 'C1',
              key: 'C1',
            },
            {
              title: '婴儿辅食',
              value: 'C2',
              key: 'C2',
            },
            {
              title: '免税液态类物品',
              value: 'C3',
              key: 'C3',
            }
          ]
        },
        {
          title: '限制随身禁止托运',
          value: 'D',
          key: 'D',
          children: [
            {
              title: '充电宝',
              value: 'D1',
              key: 'D1',
            },
            {
              title: '锂电池（含锂电池设备）',
              value: 'D2',
              key: 'D2',
            }
          ]
        }
      ]
    })
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
    let url = `/api/upload/${batchId}`
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

  onKpChange = value => {
    console.log('onChange ', value)
    this.setState({ kpValue: value })
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
    const tProps = {
      treeData: this.state.treeData,
      value: this.state.kpValue,
      onChange: this.onKpChange,
      treeCheckable: true,
      showCheckedStrategy: TreeSelect.SHOW_PARENT,
      searchPlaceholder: '请选择',
      style: {
        width: '250px',
        height: '32px',
        'overflow-y': 'scroll'
      },
    }

    return (
      <div className="m-plot-image">
        {/* 查询、筛选、打包 */}
        <div className="plot-header">
          <div className="plot-search">
            {/* 图像名称 */}
            <Form layout="inline">
              <Form.Item label="图像名称">
                <Input
                  allowClear
                  placeholder="请输入"
                  onPressEnter={e => this.search(e.target.value)}
                  // onSearch={this.search}
                />
              </Form.Item>
              <Form.Item label="标图状态">
                <Select
                  style={{ width: '100px' }}
                  placeholder="请选择"
                  // defaultValue="全部"
                  onChange={this.handlePlotStatusChange}
                >
                  <Select.Option value="all" label="全部">全部</Select.Option>
                  <Select.Option value="unplot" label="未标图">未标图</Select.Option>
                  <Select.Option value="ploted" label="已标图">已标图</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="知识点">
                <TreeSelect {...tProps}/>
              </Form.Item>
              {/* 这个是特有功能，仅限特定用户使用 */}
              <Form.Item label="嫌疑框">
                <Select
                  style={{ width: '100px' }}
                  placeholder="请选择"
                  // defaultValue="全部"
                  onChange={this.handlePlotStatusChange}
                >
                  <Select.Option value="all" label="全部">全部</Select.Option>
                  <Select.Option value="unplot" label="single">一个</Select.Option>
                  <Select.Option value="ploted" label="multi">多个</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary">查询</Button>
              </Form.Item>
            </Form>
            {/* 标记状态 */}
            {/* <Select
              style={{ width: '25%' }}
              placeholder="标图状态"
              defaultValue="全部"
              onChange={this.handlePlotStatusChange}
            >
              <Select.Option value="all" label="全部">全部</Select.Option>
              <Select.Option value="unplot" label="未标图">未标图</Select.Option>
              <Select.Option value="ploted" label="已标图">已标图</Select.Option>
            </Select> */}
            {/* 标记状态 */}
            {/* <Select
              style={{ width: '25%', 'max-height': '30px' }}
              mode="multiple"
              placeholder="图像所属类型"
              // defaultValue="全部"
            >
              <Select.Option value="all" label="全部">全部</Select.Option>
              <Select.Option value="unplot" label="未标图">未标图</Select.Option>
              <Select.Option value="ploted" label="已标图">已标图</Select.Option>
              <Select.Option value="unplot1" label="未标图1">未标图</Select.Option>
              <Select.Option value="ploted1" label="已标图1">已标图</Select.Option>
              <Select.Option value="unplot2" label="未标图2">未标图</Select.Option>
              <Select.Option value="ploted2" label="已标图2">已标图</Select.Option>
              <Select.Option value="unplot3" label="未标图3">未标图</Select.Option>
              <Select.Option value="ploted3" label="已标图3">已标图</Select.Option>
            </Select> */}

            {/* 下载图标 */}
            <Avatar
              onClick={this.onHandleWantToDownload}
              className="download"
              size={42}
              icon="cloud-download"
            />
          </div>
          {this.state.wantToDownload
            && <div className="plot-download">
                <React.Fragment>
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
              </div>
          }

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
