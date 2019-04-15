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
  let [loading, setLoading] = useState(true)
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
      <Alert message="开发中。。。" type="info" showIcon style={{marginBottom: '10px'}} />
      <Table dataSource={dataSource} columns={columns} loading={loading} locale={local} onChange={handlePageChange} rowKey="src" />
    </div>
  )
}

export default Download
