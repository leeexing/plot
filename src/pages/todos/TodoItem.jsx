import React, { Component } from 'react'
import { Button, Checkbox } from 'antd'

class TodoItem extends Component {
  handleChange () {
    let isDone = !this.props.isDone
    this.props.changeTodoState(this.props.index, isDone)
  }
  handleDelete () {
    this.props.deleteTodo(this.props.index)
  }
  render () {
    let className = this.props.isDOne ? 'task-done' : ''
    return (
      <li className="todo-item">
        <Checkbox checked={this.props.isDone} onChange={this.handleChange.bind(this)}/>
        <div>
          <span className="todo-time">{this.props.time}</span>
          <span className={className + ' task'}>{this.props.text}</span>
        </div>
        <Button className="todo-item-delete" ref="delButton" type="danger" size="small" onClick={this.handleDelete.bind(this)}>删除</Button>
      </li>
    )
  }
}

export default TodoItem
