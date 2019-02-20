import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Card } from 'antd'

import TodoHeader from './TodoHeader'
import TodoList from './TodoList'
import TodoFooter from './TodoFooter'
import './todo.less'

@inject('todoStore')
@observer
class Todo extends Component {
  componentDidMount() {
    console.groupCollapsed('%c这里有几个`mobx`异步修改数据的方法', 'color: rgb(135, 208, 104)')
    console.log(this.props.todoStore)
    console.groupEnd()
    // this.props.todoStore.testBlob()
    // this.props.todoStore.getTodos()
    // this.props.todoStore.fetchAsyncTodos()
    this.props.todoStore.fetchFlowTodos()
  }
  render () {
    let {todos, addTodo, toggleTodo, deleteTodo} = this.props.todoStore
    // let {finishAllTodos, clearTodos} = this.props.todoStore
    return (
      <div className="m-todo">
        <Card
          title="Todo List"
          style={{width: '50%'}}
        >
          <TodoHeader addTodo={addTodo}/>
          <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
          <TodoFooter/>
          {/* 另外一种写法，通过inject注入的方式获取相应的属性 */}
          {/* <TodoFooter finishAllTodos={finishAllTodos} remainingTodos={this.props.todoStore.remainingTodos} clearTodos={clearTodos} /> */}
        </Card>
      </div>
    )
  }
}

export default Todo
