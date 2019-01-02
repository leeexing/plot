import React from 'react'
import { Button, Checkbox, Tag } from 'antd'
import { inject, observer } from 'mobx-react'
// import { observer } from 'mobx-react'

// -这种通过父组件传递参数的方式获取相应的属性
// const TodoFooter = observer(props => (
//   <footer className="todo-footer">
//     <label>
//       <Checkbox checked={props.isAllChecked} onChange={props.finishAllTodos.bind(this)}></Checkbox>
//     </label>
//     <Tag>还剩 {props.remainingTodos} 项未完成 {props.isAllChecked} 66</Tag>
//     <Button type="danger" size="small" onClick={props.clearTodos}>清楚全部已完成</Button>
//   </footer>
// ))

const TodoFooter = inject('todoStore')(observer(({todoStore}) => (
  <footer className="todo-footer">
    <label>
      <Checkbox checked={todoStore.isAllChecked} onChange={todoStore.finishAllTodos.bind(this)}></Checkbox>
    </label>
    <Tag>还剩 {todoStore.remainingTodos} 项未完成</Tag>
    <Button type="danger" size="small" onClick={todoStore.clearTodos}>清楚全部已完成</Button>
  </footer>
)))


export default TodoFooter
