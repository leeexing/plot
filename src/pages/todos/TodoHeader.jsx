import React, { Component } from 'react'
import { Input } from 'antd'

class TodoHeader extends Component {
  handleKeyUp (e) {
    if (e.keyCode === 13) {
      let value = e.target.value
      if (!value.trim()) {
        return
      }
      let newTodoItem = {
        text: value,
        isDone: false
      }
      e.target.value = ''
      this.props.addTodo(newTodoItem)
    }
  }
  render () {
    return (
      <div className="todo-header">
        <Input onPressEnter={this.handleKeyUp.bind(this)} placeholder="请输入待办事项"/>
      </div>
    )
  }
}

export default TodoHeader
