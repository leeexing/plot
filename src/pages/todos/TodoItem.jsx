import React from 'react'
import { Button, Checkbox } from 'antd'
import { observer } from 'mobx-react'

// 需要习惯编写无状态函数的方式申明的组件
const TodoItem = observer((props) => (
  <li className="todo-item">
    <Checkbox checked={props.todo.isFinished} onChange={props.toggleTodo.bind(this, props.todo)}/>
    <div>
      <span className="todo-time">{props.time}</span>
      <span className={props.todo.isFinished ? 'finished' : ''}>{props.todo.title}</span>
    </div>
    <Button className="todo-item-delete" ref="delButton" type="danger" size="small" onClick={props.deleteTodo.bind(this, props.todo.id)}>删除</Button>
  </li>
))

export default TodoItem
