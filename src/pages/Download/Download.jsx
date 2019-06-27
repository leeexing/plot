import React, { Component } from 'react'
import { Divider, Input, Table, Tag, Button,
        Popconfirm, Pagination, Tooltip } from 'antd'

import api from '@/api'
import { calculateSize } from '@/util'

const statusText = ['失效', '打包中...', '打包完成']
const statusColor = ['#666', 'geekblue', 'green']


class Download extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      currentPage: 1,
      total: 0,
      limit: 20,
      isDeleting: false,
      columns: [{
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        render: (_, r, index) => <span>{index}</span>
      }, {
        title: '标签',
        dataIndex: 'tag',
        key: 'tag',
        render: tag => <span>{tag || '暂无'}</span>
      }, {
        title: '大小',
        dataIndex: 'size',
        key: 'size',
        render: (size, record) => <span>{record.status === 2 ? calculateSize(size) : '计算中...'}</span>
      }, {
        title: '打包时间',
        dataIndex: 'createTime',
        key: 'createTime',
        // sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
        // defaultSortOrder : 'ascend',
      }, {
        title: '下载次数',
        dataIndex: 'downloadCount',
        key: 'downloadCount'
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: status => {
          if (status === 0) {
            return <Tooltip title="创建时间超过一个月" placement="top">
              <Tag color={statusColor[status]}>{statusText[status]}</Tag>
            </Tooltip>
          }
          return <Tag color={statusColor[status]}>{statusText[status]}</Tag>
        }
      }, {
        title: '操作',
        dataIndex: 'src',
        key: 'src',
        width: 150,
        render: (src, record) => <span>
          {record.status === 2
            ? <React.Fragment>
                <a href={src} onClick={() => this.recordDownloadCount(record.id)} >下载</a>
                <Divider type="vertical" />
                {
                  this.confirmDelete(record)
                }
              </React.Fragment>
            : record.status === 1 ? '请等待' : this.confirmDelete(record)
          }
        </span>
      }],
      dataSource: [],
      downloadName: '',
      uploadStatus: 0
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  onDelete = data => {
    api.deletePlotDownload(data.id).then(res => {
      if (res.result) {
        let {currentPage, limit, total} = this.state
        if (total % limit === 1) {
          this.setState({
            currentPage: Math.max(1, currentPage - 1)
          }, this.fetchData)
        } else {
          this.fetchData()
        }
      }
    })
  }

  confirmDelete = record => (
    <Popconfirm title="你确定要删除吗？" onConfirm={() => this.onDelete(record)} okText="确认" cancelText="取消">
      <Button type="danger" size="small">删除</Button>
    </Popconfirm>
  )


  fetchData = () => {
    let { currentPage, limit, downloadName } = this.state
    let postData = {
      page: currentPage,
      downloadName,
      limit
    }
    api.fetchPlotDownloads(postData).then(res => {
      if (res.result) {
        this.setState({
          dataSource: res.data.downloads,
          total: res.data.count
        })
      }
    })
    .catch(console.error)
    .finally(() => {
      this.setState({
        loading: false
      })
    })
  }

  recordDownloadCount = id => {
    api.recordDownloadCount(id).then(res => {
      if (res.result) {
        this.fetchData()
      }
    }).catch(console.error)
  }

  search = value => {
    this.setState({
      downloadName: value.trim()
    }, this.fetchData)
  }

  handlePageChange = currentPage => {
    this.setState({
      currentPage
    }, this.fetchData)
  }

  render() {
    let { dataSource, columns, loading, currentPage, total, limit } = this.state
    const local = {
      emptyText: <p style={{ padding: '30px', fontSize: '18px', textAlign: 'center' }}>暂时没有下载数据，请先上传标图素材</p>
    }
    return (
      <div className="m-download">
        <div className="m-download-header" style={{ marginBottom: '10px' }}>
          <Input.Search
            style={{ width: '30%' }}
            allowClear
            enterButton
            placeholder="请输入下载标签名称"
            onPressEnter={e => this.search(e.target.value)}
            onSearch={this.search}
          />
        </div>
        <Table dataSource={dataSource} columns={columns} loading={loading} locale={local} pagination={false} rowKey="id" />
        {total > 0
          && <Pagination
                showQuickJumper
                current={currentPage}
                total={total}
                pageSize={limit}
                showTotal={total => `总共 ${total} 条`}
                onChange={this.handlePageChange}
                style={{ float: 'right', marginTop: '12px' }} />
        }
      </div>
    )
  }
}

export default Download
