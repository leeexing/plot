import React, { Component } from 'react'
import {  } from 'antd'
import TodoItem from './TodoItem'
import { observer } from 'mobx-react'

@observer
class TodoMain extends Component {

  render () {
    return (
      <ul className="todo-main">
        {
          this.props.todos.map((todo, index) => {
            // !{...this.props} 用来传递TodoMain的todos属性和delete、change方法
            return <TodoItem todo={todo} toggleTodo={this.props.toggleTodo} deleteTodo={this.props.deleteTodo} key={index}/>
          })
        }
      </ul>
    )
  }
}

export default TodoMain
