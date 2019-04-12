import React, { useEffect, useState } from 'react'
import { Alert, Table, Tag } from 'antd'

import api from '@/api'


const columns = [{
  title: '上传者',
  dataIndex: 'creator',
  key: 'creator',
}, {
  title: '上传时间',
  dataIndex: 'createTime',
  key: 'createTime',
}, {
  title: '大小',
  dataIndex: 'size',
  key: 'size',
  render: size => (
    <span>{size}KB</span>
  )
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  render: status => {
    return <Tag color={status ? 'green' : 'geekblue'}>{status ? '有效' : '失效'}</Tag>
  }
}, {
  title: '操作',
  dataIndex: 'src',
  key: 'src',
  width: 150,
  render: (src, record) => (
    <span>
      {
        record.status ? <a href={src}>下载</a> : '下载'
      }
    </span>

  )
}]

function Download () {

  let [paging, setPaging] = useState({page: 1, total: 0, limit: 10})
  let [dataSource, setDataSource] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

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
    })
  }

  const handlePageChange = (pagination) => {
    console.log(pagination)
  }

  return (
    // let { total } = this.state.paging
    <div className="m-download">
      <Alert message="开发中。。。" type="info" showIcon style={{marginBottom: '10px'}} />
      <Table dataSource={dataSource} columns={columns} onChange={handlePageChange} rowKey="src" />
    </div>
  )
}

export default Download
