import React, { Component } from 'react'
import Routes from '@/router'
import { Provider } from "mobx-react"
import store from './store'

import { configure } from 'mobx'

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' })

class App extends Component {

  render() {
    return (
      <Provider {...store}>
        <Routes/>
      </Provider>
    )
  }
}

export default App
