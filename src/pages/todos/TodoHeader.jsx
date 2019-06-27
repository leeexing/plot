import React, { Component } from 'react'
import { Input } from 'antd'
import { observer } from 'mobx-react'

@observer
class TodoHeader extends Component {
  handleKeyUp(e) {
    if (e.keyCode === 13) {
      let value = e.target.value
      if (!value.trim()) {
        return
      }
      let newTodoItem = {
        id: Math.random(),
        title: value,
        isFinished: false
      }
      this.props.addTodo(newTodoItem)
      e.target.value = ''
    }
  }

  render() {
    return (
      <div className="todo-header">
        <Input onPressEnter={this.handleKeyUp.bind(this)} placeholder="请输入待办事项"/>
      </div>
    )
  }
}

export default TodoHeader
