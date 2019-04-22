import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Avatar, Button, Divider, Table, Tag, Modal, message } from 'antd'

import api from '@/api'
import { calculateSize } from '@/util'

const statusText = ['失败', '转码中...', '成功']
const statusColor = ['geekblue', '#a0d911', 'green']


@inject('appStore')
@observer
class ImageBatchList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      total: 0,
      isDeleting: false,
      columns: [
        {
          title: '名称',
          dataIndex: '_id',
          key: '_id',
          render: (_id, record) => (
            <span>{record.fileName}</span>
          )
        }, {
          title: '大小',
          dataIndex: 'size',
          key: 'size',
          render: size => <span>{calculateSize(size)}</span>
        }, {
          title: '上传时间',
          dataIndex: 'createTime',
          key: 'createTime',
        }, {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (status) => (
            <Tag color={statusColor[status]}>{statusText[status]}</Tag>
          )
        }, {
          title: '操作',
          width: 150,
          render: record => (
            <span>
              <Button disabled={record.status <= 0} onClick={this.onHandlePlot.bind(this, record)} type="primary" size="small">详情</Button>
              <Divider type="vertical" />
              <Button disabled={record.status <= 1} onClick={this.onHandleDelete.bind(this, record)} type="danger" size="small">删除</Button>
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
    // -其他请求获取图像标记列表
    api.fetchPlotUploads(data).then(res => {
      console.log(res)
      if (res.result) {
        this.setState({
          loading: false,
          total: res.data.count,
          dataSource: res.data.uploads
        })
      }
    }).catch(() => {
      this.setState({
        loading: false
      })
    })
  }

  deleteUploadFile = id => {
    console.log(id)
    api.deletePlotUploadBatch(id).then(res => {
      console.log(res)
      if (res.result) {
        message.success('文件删除成功！')
        this.fetchData()
      }
    })
  }

  uploadImage = () => {
    this.props.appStore.toggleUploaderGlobal(true)
    this.props.appStore.toggleUploaderMini(false)
  }

  onHandlePlot = data => {
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
    this.props.history.push(`/plot/${data._id}`)
  }

  onHandleDelete = data => {
    Modal.confirm({
      title: `你确定要删除该文件吗？`,
      content: <div>
        <p>文件名：<span style={{fontWeight: 600, color: 'red'}}>{data.fileName}</span></p>
        <p>该操作不可逆，请慎重考虑!</p>
      </div>,
      onOk: () => {
        if (this.setState.isDeleting) {
          return
        }
        this.setState({
          isDeleting: true
        })
        this.deleteUploadFile(data._id)
      },
      onCancel () {
        console.log('cancel')
      }
    })
  }

  render () {
    let {loading, dataSource, columns} = this.state
    let local = {
      emptyText: <p className="m-plot-info">暂时没有标图数据，请先上传标图素材</p>
    }
    return (
      <div className="m-plot">
        <div className="m-plot-upload" onClick={this.uploadImage}>
          <Avatar size={64} icon="cloud-upload" style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} />
          <p>点击进行图像上传<span>(仅支持zip、rar压缩文件)</span></p>
        </div>
        {/* {this.state.dataSource.length < 1
            ? <p className="m-plot-info">暂时没有标图数据，请先上传标图素材</p>
            : <Table dataSource={dataSource} columns={columns} loading={loading} />
        } */}
        <Table dataSource={dataSource} columns={columns} loading={loading} locale={local} rowKey="_id" />
      </div>
    )
  }
}

export default ImageBatchList
