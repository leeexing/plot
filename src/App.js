import React, { Component } from 'react'
import { Provider } from "mobx-react"
import { configure } from 'mobx'

import Routes from '@/router'
import store from './store'

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' })


class App extends Component {

  render() {
    return (
      <Provider {...store}>
        <Routes />
      </Provider>
    )
  }
}

export default App
