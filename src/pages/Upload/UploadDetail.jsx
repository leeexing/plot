import React, { useState, useEffect } from 'react'
import { Table, Tag } from 'antd'

import api from '@/api'

function UploadDetail(props) {

  let { uploadId } = props.match.params
  const [loading, setLoading] = useState(true)
  const [uploadLogs, setUploadLogs] = useState([])
  const [filteredInfo, setFilteredInfo] = useState({})

  useEffect(() => {
    api.fetchUploadProcessLog(uploadId).then(res => {
      if (res.result) {
        setUploadLogs(res.data.uploadLogs)
        setLoading(false)
      }
    }).catch(err => {
      console.log(err)
    })
  }, [])

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters)
  }

  const columns = [
    {
      title: '序号',
      width: 150,
      dataIndex: '_',
      key: '_',
      render: (_, r, index) => <span>{index + 1}</span>
    },
    {
      title: '类型',
      dataIndex: 'level',
      key: 'level',
      width: 150,
      filters: [{ text: '成功', value: 1 }, { text: '失败', value: 2 }],
      filteredValue: filteredInfo.level || null,
      onFilter: (value, record) => record.level === value,
      render: level => {
        return <Tag color={level === 1 ? 'green' : 'red'}>{ level === 1 ? '成功' : '失败'}</Tag>
      }
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '信息',
      dataIndex: 'message',
      key: 'message',
    },
  ]

  return (
    <div>
      <Table dataSource={uploadLogs} columns={columns} loading={loading} onChange={handleChange} rowKey="id" />
    </div>
  )
}

export default UploadDetail
