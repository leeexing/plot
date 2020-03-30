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
import { inject, observer } from 'mobx-react'

@inject('userStore')
@observer
class ImagePlot extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageList: [],
      currentPage: 1,
      pageSize: 20,
      limit: 10000,
      total: 0,
      isFull: false,
      src: '',
      tag: '',
      wantToDownload: false,
      isSelectQueryAll: false,
      selectedImageIds: new Set(),
      selectedImageCount: 0,
      plotStatus: 0,
      renameModal: false,
      imageName: '',
      imageNewName: '',
      renameImageId: null,
      loading: true,
      suspectId: [],
      treeData: [],
      suspectNum: 0,
      isNuctech: false
    }
  }

  componentDidMount() {
    if (this.props.userStore.enterpriseCode === '00') {
      this.setState({
        isNuctech: true
      })
      this.fetchImgKp()
    }
    this.fullScreenDOM = document.getElementById('fullscreen')
    this.fetchData()
    // 监听全屏界面传递过来的提交标注图像的消息
    window.onmessage = msgEvent => {
      let { type, id, postData } = msgEvent.data
      if (type === 'submitPlot') {
        console.log(88888, msgEvent)
        api.updateImgSuspect(id, JSON.parse(postData)).then(res => {
          this.fetchData()
        }).catch(console.error)
      }
    }
  }

  // 后端分页
  fetchData = (updatePageNum = false) => {
    let { batchId } = this.props.match.params
    let { currentPage, pageSize, plotStatus, imageName, suspectNum, suspectId } = this.state
    let data = {
      imageName,
      plotStatus,
      suspectNum,
      suspectId,
      limit: pageSize,
      page: updatePageNum ? 1 : currentPage,
    }
    console.log('查询参数', data)
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

  // 获取设置图像知识点树（列表）
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

  // -标注状态
  handlePlotStatusChange = value => {
    this.setState({
      plotStatus: value
    }, this.fetchData.bind(this, true))
  }

  // -嫌疑物知识点
  handleSuspectKpChange = (value) => {
    console.log('嫌疑物知识点', value)
    this.setState({ suspectId: value })
  }

  // -是否含多个嫌疑物
  handleSuspectCountChange = (value) => {
    console.log('是否含多个嫌疑物', value)
    this.setState({ suspectNum: value }, this.fetchData.bind(this, true))
  }

  search = value => {
    this.setState({
      imageName: value.trim()
    }, this.fetchData.bind(this, true))
  }

  handlePageChange = currentPage => {
    this.setState({
      currentPage
    }, this.fetchData)
  }

  onhandleTag = e => {
    this.setState({
      tag: e.target.value
    })
  }

  onHandleWantToDownload = () => {
    this.setState({
      wantToDownload: !this.state.wantToDownload
    })
  }

  // 全选。isSelectAllNotReverse: false 反选
  onHandleSelectAll = (isSelectAllNotReverse = true) => {
    let { imageList, selectedImageIds } = this.state
    imageList.forEach(item => {
      if (isSelectAllNotReverse) {
        selectedImageIds.add(item.id)
      } else {
        // 反向选择
        selectedImageIds.has(item.id)
          ? selectedImageIds.delete(item.id)
          : selectedImageIds.add(item.id)
      }
    })
    this.setState({
      selectedImageCount: this.state.selectedImageIds.size
    })
  }

  // -选中所有查询出来的图像
  onHandleSelectQueryAll = () => {
    let isSelectQueryAll = !this.state.isSelectQueryAll
    let selectedImageCount = isSelectQueryAll ? this.state.total : this.state.selectedImageIds.size
    this.setState({
      isSelectQueryAll,
      selectedImageCount,
    })
  }

  // 打包下载
  onHandleDownload(isPack = true)  {
    if (!isPack) {
      this.resetDownloadStatus()
      return
    }
    if (!this.state.tag.trim()) {
      return message.warn('标签名不能为空')
    }
    let data = {
      tag: this.state.tag.trim(),
      isPackBySearch: false
    }
    let { imageName, plotStatus, suspectId, suspectNum, total } = this.state
    // -打包所有的话，只需要带上查询条件即可
    if (this.state.isSelectQueryAll) {
      data.isPackBySearch = true
      let { batchId } = this.props.match.params
      let uploadID = batchId
      data.searchParams = { imageName, plotStatus, suspectId, suspectNum, total, uploadID }
    } else {
      data.packIds = [...this.state.selectedImageIds]
    }
    api.packPlotImages(data).then(res => {
      if (res.result) {
        message.success('图像开始打包中...')
      }
    }).catch(console.log)
    .finally(() => {
      this.resetDownloadStatus()
    })
  }

  // 重置取消下载按钮后的各变量状态
  resetDownloadStatus() {
    this.setState({
      tag: '',
      wantToDownload: false,
      isSelectQueryAll: false,
      selectedImageCount: 0,
      selectedImageIds: new Set()
    })
  }

  onHandleSelect(item) {
    let { selectedImageIds } = this.state
    if (selectedImageIds.has(item.id)) {
      selectedImageIds.delete(item.id)
    } else {
      selectedImageIds.add(item.id)
    }
    this.setState({
      selectedImageIds,
      selectedImageCount: selectedImageIds.size
    })
  }

  // 点击图像进行标注。如果是选择状态，不进行全屏标注
  plotImage(item) {
    if (this.state.isSelectQueryAll) {
      return
    }
    if (this.state.wantToDownload) {
      return this.onHandleSelect(item)
    }
    let { batchId } = this.props.match.params
    let { imageName, plotStatus, total, currentPage,
      pageSize, suspectId, suspectNum, isNuctech } = this.state
    let url = `/api/upload/${batchId}`
    this.setState({
      isFull: true,
      src: `/3D/DR_base.html?type=MAP_BROWSE
          &url=${url}
          &count=${total}
          &page=${currentPage}
          &limit=${pageSize}
          &initShowId=${item.id}
          &imageName=${encodeURI(imageName)}
          &plotStatus=${plotStatus}
          &suspectId=${JSON.stringify(suspectId)}
          &suspectNum=${suspectNum}
          &isNuctech=${Number(isNuctech)}`.replace(/\s+/g, '')
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
    }).catch(console.log)
  }

  // click关闭也会触发resize关闭。这里控制只有最后的esc才执行
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
    let {
      currentPage,
      total,
      pageSize,
      imageName,
      imageNewName,
      imageList,
      selectedImageIds,
      isSelectQueryAll,
      isNuctech
    } = this.state
    const tProps = {
      treeData: this.state.treeData,
      value: this.state.suspectId,
      onChange: this.handleSuspectKpChange,
      treeCheckable: true,
      // showCheckedStrategy: TreeSelect.SHOW_ALL,
      // showCheckedStrategy: TreeSelect.SHOW_PARENT,
      searchPlaceholder: '请选择',
      allowClear: true,
      maxTagCount: 1,
      style: {
        width: '250px',
        height: '32px',
        'overflowY': 'scroll'
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
                />
              </Form.Item>
              <Form.Item label="标图状态">
                <Select
                  allowClear
                  style={{ width: '100px' }}
                  placeholder="请选择"
                  onChange={this.handlePlotStatusChange}
                >
                  <Select.Option value="0" label="全部">全部</Select.Option>
                  <Select.Option value="1" label="未标图">未标图</Select.Option>
                  <Select.Option value="2" label="已标图">已标图</Select.Option>
                </Select>
              </Form.Item>
              {/* 图像知识点 */}
              {isNuctech
                && <Form.Item label="知识点" className="bugStyle">
                    <TreeSelect {...tProps}/>
                  </Form.Item>
              }
              {/* 这个是特有功能，仅限特定用户使用 */}
              {isNuctech
                && <Form.Item label="嫌疑物">
                    <Select
                      allowClear
                      style={{ width: '100px' }}
                      placeholder="请选择"
                      onChange={this.handleSuspectCountChange}
                    >
                      <Select.Option value="0" label="全部">全部</Select.Option>
                      <Select.Option value="1" label="single">单个</Select.Option>
                      <Select.Option value="2" label="multi">多个</Select.Option>
                    </Select>
                  </Form.Item>
              }
              <Form.Item>
                <Button type="primary" onClick={this.fetchData.bind(this, true)}>查询</Button>
              </Form.Item>
            </Form>

            {/* 下载图标 */}
            <Avatar
              onClick={this.onHandleWantToDownload}
              className="download"
              size={42}
              icon="cloud-download"
            />
          </div>

          {/* 下载图像选择选项 */}
          {this.state.wantToDownload
            && <div className="plot-download">
                <React.Fragment>
                  <Input
                    onChange={this.onhandleTag}
                    placeholder="请输入此次下载的标签名"
                    style={{ width: '350px' }}
                  />
                  <div className="download-btns">
                      <Button onClick={this.onHandleSelectAll.bind(this)} disabled={isSelectQueryAll} type="primary">全选</Button>
                      <Button onClick={this.onHandleSelectAll.bind(this, false)} disabled={isSelectQueryAll} type="primary" ghost>反选</Button>
                      <Button onClick={this.onHandleSelectQueryAll} type="primary" ghost={!isSelectQueryAll}>全选整个查询</Button>
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
                            {this.state.wantToDownload && !isSelectQueryAll
                              ? (selectedImageIds.has(item.id)
                                ? <PackIcon onClick={this.onHandleSelect.bind(this, item, index, false)} style={{ color: '#eb2f96' }} />
                                : <PackIcon onClick={this.onHandleSelect.bind(this, item, index, true)} />
                              )
                              : null
                            }
                          </div>
                        </div>
                        <div className="image-wrap" onClick={this.plotImage.bind(this, item, index)}>
                          <img className="thumbnail" src={item.thumbnails.length > 0 ? item.thumbnails[0].url : item.dr[0].url} alt="" />
                        </div>
                        <div className="image-name">
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

export default ImagePlot
