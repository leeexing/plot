import React, { useEffect } from 'react'
import { notification } from 'antd'

import { SIGNALR_URL } from '@/api/config'

const signalR = require('@aspnet/signalr')


function SignalrMessage () {

  let connection

  const startSignal = () => {
    connection.start(signalR.TransferFormat.Text)
        .then(res => {})
        .catch(err => console.log('Error opening connection：', err))
  }

  useEffect(() => {
    connection = new signalR.HubConnectionBuilder()
    .withUrl(SIGNALR_URL, {accessTokenFactory: () => localStorage.getItem('signalrToken')})
    .build()

    // 监听消息提示
    connection.on('PlotNoticeReceived', (type, msg) => {
      console.log('接收消息>>>', msg)
      notification.success({
        message: '消息通知',
        description: msg
      })
    })
    // signal 连接错误
    connection.onclose(err => {
      if (err) {
        // 连接时出现错误，尝试重连
        startSignal()
        console.error('Connection closed with error: ' + err)
      } else {
        console.log('%c Disconnected by myself', 'color:green')
      }
    })

    startSignal()
  }, [])

  const stopSignal = () => {
    connection.stop().then(res => {}).catch(err => {})
  }

  useEffect(() => stopSignal, [])

  return <div></div>
}

export default SignalrMessage
