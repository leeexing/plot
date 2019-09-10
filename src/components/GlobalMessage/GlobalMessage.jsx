import React, { Component } from 'react'
import io from 'socket.io-client'
import { notification, Icon } from 'antd'


class GlobalMessage extends Component {

  componentDidMount() {
    const socket = io.connect('http://localhost:5281/IMAGE_PLOT')
    socket.on('connect', () => {
      console.log('前端连接了socket，和后台无关')
    })
    socket.on('server_response', data => {
      console.log(data)
      if (data.type === 1) {
        notification.info({
          message: data.data
        })
      } else {
        notification.warning({
          message: data.data,
          icon: <Icon type="frown" style={{ color: '#f90' }} />
        })
      }
    })
  }

  render() {
    return (
      <div className="app-message"></div>
    )
  }
}

export default GlobalMessage
