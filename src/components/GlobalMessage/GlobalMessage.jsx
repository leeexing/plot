import React, { Component } from 'react'
import io from 'socket.io-client'
import { notification  } from 'antd'


class GlobalMessage extends Component {

  handleMessage (data) {
    console.log(data, 999)
  }

  componentDidMount () {
    const socket = io.connect('http://localhost:5281/MESSAGE_BOX')
    socket.on('server_response', data => {
      console.log(data)
      notification.info({
        message: data.data
      })
    })
  }

  render () {
    return (
      <div className="app-message">
      </div>
    )
  }
}

export default GlobalMessage
