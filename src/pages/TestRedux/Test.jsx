import React from 'react'
import { Provider } from 'react-redux'
import { Link, Route, Switch } from 'react-router-dom'

import { Menu, Icon } from 'antd'

import store from '@/storeRedux'
import TestRedux from './TestRedux'
import TestHooks from './TestHooks'
import TestReducer from './TestReducer'

function Test () {
  return (
    <Provider store={store}>
      <Menu mode="horizontal" style={{marginBottom: '10px'}}>
        <Menu.Item><Link to="/Test/redux">Redux</Link></Menu.Item>
        <Menu.Item><Link to="/Test/hooks">Hooks</Link></Menu.Item>
        <Menu.Item><Link to="/Test/b"><Icon type="bold" /></Link></Menu.Item>
      </Menu>
      <React.Fragment>
        <Switch>
          <Route path={`/Test/redux`} exact component={TestRedux}/>
          <Route path={`/Test/hooks`} exact component={TestHooks}/>
          <Route path={`/Test/b`} exact component={TestReducer}/>
        </Switch>
      </React.Fragment>
    </Provider>
  )
}

export default Test
