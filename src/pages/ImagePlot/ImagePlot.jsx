import React, { Component } from 'react'
import { Alert, Button, Badge, Icon, Pagination, Tooltip, Skeleton } from 'antd'
import FullScreen from 'components/FullScreen'
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
      wantToDownload: false,
      selectedImageIds: new Set(),
      selectedImageCount: 0,
    }
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData () {
    let data = {
      page: this.state.currentPage,
      limit: 20,
    }
    // -其他请求获取图像标记列表
    api.fetchDRImages(data).then(res => {
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

  onHandleDownload (value=true)  {
    if (value) {
      console.log('下载')
      console.log(this.state.selectedImageIds)
    } else {
      this.state.selectedImageIds.clear()
      this.setState({
        wantToDownload: false,
        selectedImageCount: this.state.selectedImageIds.size
      })
    }
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
    console.log(item)
    this.setState({
      isFull: true,
      src: `/3D/DR_base.html?type=MAP_BROWSE&count=${this.state.total}&page=${this.state.currentPage}&limit=50&viewCount=2`
    })
    this.refs.fullScreen.openFullScreen()
    // this.props.history.push('/plot/' + item._id)
  }

  closeFullScreen = () => {
    this.setState({
      isFull: false,
      src: ''
    })
  }

  render () {
    return (
      <div className="m-image-plot">
        <Alert message="点击图像进行在线标图" type="info" showIcon closable style={{marginBottom: '10px'}} />
        {/* 图像批次详情 */}
        <div className="image-batch-detail">

        </div>
        <div style={{marginBottom: '10px'}}>
          {
            !this.state.wantToDownload
            ? <Button onClick={this.onHandleWantToDownload} icon="download" type="primary">下载</Button>
            : <div>
                <Button onClick={this.onHandleSelectAll.bind(this)} type="primary" style={{marginLeft: '5px'}}>全选</Button>
                <Button onClick={this.onHandleSelectAll.bind(this, false)} type="primary" ghost style={{marginLeft: '5px'}}>反选</Button>
                <Button onClick={this.onHandleDownload.bind(this)} disabled={this.state.selectedImageCount === 0 } type="primary" style={{marginLeft: '5px'}}>
                  <Badge count={this.state.selectedImageCount} offset={[10, -10]}>
                    下载
                  </Badge>
                </Button>
                <Button onClick={this.onHandleDownload.bind(this, false)} type="dashed" style={{marginLeft: '5px'}}>取消</Button>
            </div>
          }
        </div>
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
                          (this.state.wantToDownload && !item.isSelected) && <Icon onClick={this.onHandleSelect.bind(this, item, index, true)} type="shopping-cart"/>
                        }
                        {
                          (this.state.wantToDownload && item.isSelected) && <Icon onClick={this.onHandleSelect.bind(this, item, index, false)} type="heart" theme="twoTone" twoToneColor="#eb2f96" />
                        }
                      </div>
                      <div className="image-handle">
                        <Tooltip title="全屏查看" placement="bottom">
                          <Icon type="heat-map" />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="image-wrap" onClick={this.plotImage.bind(this, item)}>
                      <img className="thumbnail" src={item.thumbnails[0].url} alt="" />
                    </div>
                    <h3 className="image-name">{}</h3>
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
          ></FullScreen>
      </div>
    )
  }
}

export default HomePage
