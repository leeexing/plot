import React, { useEffect, useState } from 'react'
import { Divider, Table, Tag, Popconfirm } from 'antd'

import api from '@/api'
import { calculateSize } from '@/util'

const statusText = ['失效', '打包中...', '打包完成']
const statusColor = ['#666', 'geekblue', 'green']


function Download () {

  let [paging, setPaging] = useState({page: 1, total: 0, limit: 10})
  let [loading, setLoading] = useState(true)
  let [dataSource, setDataSource] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const onDelete = data => {
    api.deletePlotDownload(data._id).then(res => {
      if (res.result) {
        fetchData()
      }
    })
  }

  const confirmDelete = record => (
    <Popconfirm title="你确定要删除吗？" onConfirm={() => onDelete(record)} okText="Yes" cancelText="No">
      <a href="#" style={{color: 'red'}}>删除</a>
    </Popconfirm>
  )

  const columns = [{
    title: '序号',
    dataIndex: '_id',
    key: '_id',
    render: (_, r, index) => <span>{index}</span>
  }, {
    title: '标签',
    dataIndex: 'tag',
    key: 'tag',
    render: tag => <span>{tag || '暂无'}</span>
  }, {
    title: '上传时间',
    dataIndex: 'createTime',
    key: 'createTime',
  }, {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
    render: (size, record) => <span>{record.status === 2 ? calculateSize(size) : '计算中...'}</span>
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: status => <Tag color={statusColor[status]}>{statusText[status]}</Tag>
  }, {
    title: '操作',
    dataIndex: 'src',
    key: 'src',
    width: 150,
    render: (src, record) => <span>
      {record.status === 2
        ? <React.Fragment>
            <a href={src}>下载</a>
            <Divider type="vertical" />
            {
              confirmDelete(record)
            }
          </React.Fragment>
        : record.status === 1 ? '请等待' : confirmDelete(record)
      }
    </span>
  }]

  const fetchData = () => {
    let {page, limit} = paging
    api.fetchPlotDownloads({page, limit}).then(res => {
      if (res.result) {
        console.log(res)
        setDataSource(res.data.downloads)
        setPaging({
          total: res.data.count
        })
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  const handlePageChange = (pagination) => {
    console.log(pagination)
  }

  const local = {
    emptyText: <p style={{padding: '30px', fontSize: '18px', textAlign: 'center'}}>暂时没有下载数据，请先上传标图素材</p>
  }

  return (
    <div className="m-download">
      {/* <Alert message="开发中。。。" type="info" showIcon style={{marginBottom: '10px'}} /> */}
      <Table dataSource={dataSource} columns={columns} loading={loading} locale={local} onChange={handlePageChange} rowKey="_id" />
    </div>
  )
}

export default Download
