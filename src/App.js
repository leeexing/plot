import React, { Component } from 'react'
import { Provider } from "mobx-react"
import { configure } from 'mobx'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'

import Routes from '@/router'
import store from './store'

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' })


class App extends Component {

  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        <Provider {...store}>
          <Routes />
        </Provider>
      </LocaleProvider>
    )
  }
}

export default App
