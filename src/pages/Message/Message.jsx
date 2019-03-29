import React, { useState, useEffect } from 'react'
import { Button, Tag } from 'antd'
import { DRIcon } from '@/icon'


function Message () {
  const [count, setCount] = useState(0)

  // const handleClick = () => {
  //   let n = count + 1
  //   setCount(n)
  // }

  useEffect(() => {
    console.log('start...')
  }, [])

  useEffect(() => {
    console.log(count)
  })

  useEffect(() => {
    console.log(count + '-Tee')
  })

  return (
    <div className="m-message">
      <h3>个人消息</h3>
      <div>
        <DRIcon style={{fontSize: '28px'}}></DRIcon>
        <Tag>{count}</Tag>
      </div>
      <Button type="primary" onClick={() => setCount(count + 2)}>点击</Button>
    </div>
  )
}

export default Message
