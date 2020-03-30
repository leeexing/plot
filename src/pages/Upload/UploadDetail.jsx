import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Tag, Tooltip, message } from 'antd'

import api from '@/api'
import { getUrlSearch } from '@/util'

function UploadDetail(props) {

  let { taskId } = props.match.params
  let { type } = getUrlSearch(props.location.search)
  const [loading, setLoading] = useState(true)
  const [uploadLogs, setUploadLogs] = useState([])
  const [filteredInfo, setFilteredInfo] = useState({})

  const fetchLogData = useCallback(() => {
    let logType = type === 'upload' ? 'fetchUploadProcessLog' : 'fetchDownloadProcessLog'
    api[logType](taskId).then(res => {
      console.log(res)
      if (res.result) {
        setUploadLogs(res.data.logs)
        setLoading(false)
      }
    }).catch(err => {
      console.log(err)
    })
  }, [type])

  useEffect(() => {
    fetchLogData()
  }, [])

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters)
  }

  const goback = () => {
    props.history.go(-1)
  }

  const refresh = useCallback(() => {
    fetchLogData()
    message.destroy()
    message.info('手动刷新成功！')
  }, [fetchLogData])

  const tagColors = ['green', 'orange', 'red']
  const tagName = ['成功', '提醒', '错误']

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
      filters: [{ text: '成功', value: 1 }, { text: '提醒', value: 2 }, { text: '错误', value: 3 }],
      filteredValue: filteredInfo.level || null,
      onFilter: (value, record) => record.level === value,
      render: level => <Tag color={tagColors[level - 1]}>{ tagName[level - 1] }</Tag>
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '信息',
      dataIndex: 'message',
      key: 'message'
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: '5px', textAlign: 'right' }}>
        <Tooltip title="返回" placement="bottom">
          <Button onClick={goback} icon="rollback" style={{ marginRight: '5px' }} />
        </Tooltip>
        <Tooltip title="手动刷新" placement="bottomLeft">
          <Button onClick={refresh} icon="sync" />
        </Tooltip>
      </div>
      <Table dataSource={uploadLogs} columns={columns} loading={loading} onChange={handleChange} rowKey="id" />
    </div>
  )
}

export default UploadDetail
