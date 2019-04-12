import React, { useEffect, useState } from 'react'
import { Alert, Table, Tag } from 'antd'

import api from '@/api'

const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  status: '失效',
  address: '西湖区湖底公园1号'
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  status: '有效',
  address: '西湖区湖底公园1号'
}]

const columns = [{
  title: '序号',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '上传时间',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  render: status => {
    return <Tag color={status === '有效' ? 'green' : 'geekblue'}>{status}</Tag>
  }
}, {
  title: '操作',
  dataIndex: 'address',
  key: 'address',
  width: 150,
  render: () => (
    <span>
      <a href="/">下载</a>
    </span>
  )
}]

function Download () {

  let [paging, setPaging] = useState({page: 1, total: 0, limit: 10})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    let {page, limit} = paging
    api.fetchPlotDownload({page, limit}).then(res => {
      if (res.result) {
        console.log(res)
      }
    })
  }

  return (
    // let { total } = this.state.paging
    <div className="m-download">
      <Alert message="开发中。。。" type="info" showIcon style={{marginBottom: '10px'}} />
      <Table dataSource={dataSource} columns={columns} />
    </div>
  )
}

export default Download
