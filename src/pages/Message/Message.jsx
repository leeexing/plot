import React, { useState, useEffect, useRef } from 'react'
import { Button, Tag } from 'antd'

import { DRIcon } from '@/icon'


function Message () {
  const [count, setCount] = useState(0)
  const preCount = usePrevious(count)
  const forceUdate = useForceUpdate()
  const isMounted = useIsMounted()

  useMount(() => {
    console.log('start...')
    console.log(isMounted)
  })

  useUnmount(() => {
    console.log('unmount~~~')
    console.log(isMounted)
  })

  useEffect(() => {
    console.log(count)
    console.log(preCount, 'pre')
  })

  useUpdate(() => {
    console.log(count + '-Tee')
    console.log(isMounted)
  })

  return (
    <div className="m-message">
      <h3>个人消息 <DRIcon style={{fontSize: '28px'}}></DRIcon></h3>
      <div style={{padding: '10px'}}>
        <Tag>{preCount} - {count}</Tag>
      </div>
      <Button type="primary" onClick={() => setCount(count + 2)}>点击</Button>
      <Button type="danger" onClick={() => forceUdate(Date.now())}>强制刷新</Button>
    </div>
  )
}

function useMount (fn) {
  useEffect(() => {
    fn()
  }, [])
}

function useUnmount (fn) {
  useEffect(() => fn, [])
}

function useUpdate (fn) {
  const mounting = useRef(true)
  useEffect(() => {
    if (mounting.current) {
      mounting.current = false
    } else {
      fn()
    }
  })
}

function useForceUpdate () {
  return useState(0)[1]
}

function useIsMounted () {
  const [isMount, setIsMount] = useState(false)
  useEffect(() => {
    if (!isMount) {
      setIsMount(true)
    }
    return () => setIsMount(false)
  }, [])
  return isMount
}

function usePrevious (value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export default Message
