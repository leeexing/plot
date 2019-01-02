import React, { Component } from 'react'
import { Button, Checkbox } from 'antd'
import { observer } from 'mobx-react'

@observer
class TodoItem extends Component {
  handleChange (todo) {
    // let isFinished = !this.props.todo.isFinished
    // this.props.todo.isFinished = isFinished
    this.props.toggleTodo(todo)
  }
  handleDelete () {
    this.props.deleteTodo(this.props.todo.id)
  }
  render () {
    let className = this.props.todo.isFinished ? 'finished' : ''
    return (
      <li className="todo-item">
        <Checkbox checked={this.props.todo.isFinished} onChange={this.handleChange.bind(this, this.props.todo)}/>
        <div>
          <span className="todo-time">{this.props.time}</span>
          <span className={className + ' task'}>{this.props.todo.title}</span>
        </div>
        <Button className="todo-item-delete" ref="delButton" type="danger" size="small" onClick={this.handleDelete.bind(this, this.props.todo.id)}>删除</Button>
      </li>
    )
  }
}

export default TodoItem
