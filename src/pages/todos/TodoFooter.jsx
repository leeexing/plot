import React, { Component } from 'react'
import { Button, Checkbox, Tag } from 'antd'

class TodoFooter extends Component {
  deleteAll () {
    this.props.clearDone()
  }
  changeAll (e) {
    this.props.changeTodoState(null, e.target.checked, true)
  }
  render () {
    let remain = this.props.todoCount - this.props.todoDoneCount
    return (
      <footer className="todo-footer">
        <label>
          <Checkbox checked={this.props.isAllChecked} onChange={this.changeAll.bind(this)}></Checkbox>
        </label>
        <Tag>还剩 {remain} 未完成</Tag>
        <Button type="danger" size="small" onClick={this.deleteAll.bind(this)}>清楚全部已完成</Button>
      </footer>
    )
  }
}

export default TodoFooter
