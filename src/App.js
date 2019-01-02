import React, { Component } from 'react'
import Routes from '@/router'
import { Provider } from "mobx-react"
import store from './store'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Routes/>
      </Provider>
    )
  }
}

export default App
