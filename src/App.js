import React, { Component } from 'react'
import { Provider } from "mobx-react"
import { configure } from 'mobx'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'

import Routes from '@/router'
import store from './store'

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' })


class App extends Component {

  render() {
    return (
      <ConfigProvider locale={zh_CN}>
        <Provider {...store}>
          <Routes />
        </Provider>
      </ConfigProvider>
    )
  }
}

export default App
