import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Avatar, Button, Divider, Icon, Table, Tag, Skeleton } from 'antd'

import api from '@/api'


@inject('appStore')
@observer
class ImageBatchList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      columns: [
        {
          title: '素材包名',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: '大小(M)',
          dataIndex: 'age',
          key: 'age',
        }, {
          title: '上传时间',
          dataIndex: 'address',
          key: 'address',
        }, {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (status) => (
            <Tag color={status ? 'green' : 'geekblue'}>{status === 1 ? '正常' : '失效'}</Tag>
          )
        }, {
          title: '操作',
          key: 'operation',
          width: 150,
          render: (text, record) => (
            <span>
              <Button onClick={this.onHandlePlot} type="primary" size="small">详情</Button>
              <Divider type="vertical" />
              <Button type="danger" size="small">删除</Button>
            </span>
          )
        }
      ],
      dataSource: [],
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
    const dataSource = [
      {
        key: '1',
        name: '42423452345',
        age: 32,
        status: 1,
        address: '2019-02-21 14:56:12'
      }, {
        key: '2',
        name: '2345343rfc3',
        age: 42,
        status: 1,
        address: '2019-02-22 11:56:34'
      }
    ]
    // -其他请求获取图像标记列表
    api.fetchDRImages(data).then(res => {
      if (res.result) {
        this.setState({
          loading: false,
          dataSource
        })
      }
    }).catch(() => {
      this.setState({
        loading: false
      })
    })
  }

  uploadImage = () => {
    this.props.appStore.toggleUploaderGlobal(true)
    this.props.appStore.toggleUploaderMini(false)
  }

  onHandlePlot = (data) => {
    this.props.appStore.updateNavBreadcrumb([
      {
        path: 'plot',
        name: '标图素材'
      },
      {
        path: 'plotDetail',
        name: '在线标图'
      }
    ])
    this.props.history.push('/plot/1')
  }

  render () {
    return (
      <div className="m-plot">
        <div className="m-plot-upload" onClick={this.uploadImage}>
          <Avatar size={64} icon="cloud-upload" style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} />
          <p>点击进行图像上传<span>(zip，rar 压缩文件)</span></p>
        </div>
        {this.state.loading
          ? <Skeleton></Skeleton>
          : this.state.dataSource.length < 1
            ? <p className="m-plot-info">暂时没有标图数据，请先上传标图素材</p>
            : <Table dataSource={this.state.dataSource} columns={this.state.columns} />
        }
      </div>
    )
  }
}

export default ImageBatchList
