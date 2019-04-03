import React from 'react'
import { Provider } from 'react-redux'
import { Link, Route, Switch } from 'react-router-dom'

import { Menu, Icon } from 'antd'

import store from '@/storeRedux'
import TestRedux from './TestRedux'
import TestHooks from './TestHooks'
import TestReducer from './TestReducer'
import Todo from 'pages/Todolist'

function Test () {
  return (
    <Provider store={store}>
      <Menu mode="horizontal" style={{marginBottom: '10px'}}>
        <Menu.Item><Link to="/test/redux">Redux</Link></Menu.Item>
        <Menu.Item><Link to="/test/hooks">Hooks</Link></Menu.Item>
        <Menu.Item><Link to="/test/b"><Icon type="bold" /></Link></Menu.Item>
        <Menu.Item><Link to="/test/todo"><Icon type="medium" /></Link></Menu.Item>
      </Menu>
      <React.Fragment>
        <Switch>
          <Route path={`/test/redux`} exact component={TestRedux}/>
          <Route path={`/test/hooks`} exact component={TestHooks}/>
          <Route path={`/test/b`} exact component={TestReducer}/>
          <Route path={`/test/todo`} exact component={Todo}/>
        </Switch>
      </React.Fragment>
    </Provider>
  )
}

export default Test
