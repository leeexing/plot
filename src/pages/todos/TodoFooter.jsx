import React, { Component } from 'react'
import { Button, Checkbox, Tag } from 'antd'
import { inject, observer } from 'mobx-react'

@inject('todoStore')
@observer
class TodoFooter extends Component {
  changeAll (e) {
    this.props.changeTodoState(null, e.target.checked, true)
  }
  render () {
    let remain = this.props.todoStore.remainingTodos
    return (
      <footer className="todo-footer">
        <label>
          <Checkbox checked={this.props.isAllChecked} onChange={this.props.todoStore.finishAllTodos}></Checkbox>
        </label>
        <Tag>还剩 {remain} 项未完成</Tag>
        <Button type="danger" size="small" onClick={this.props.todoStore.clearTodos}>清楚全部已完成</Button>
      </footer>
    )
  }
}

export default TodoFooter
