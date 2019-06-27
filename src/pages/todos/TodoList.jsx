import React from 'react'
import TodoItem from './TodoItem'
import { observer } from 'mobx-react'


const TodoMain = observer(props => (
  <ul className="todo-main">
    {props.todos.map((todo, index) => {
        return <TodoItem todo={todo} toggleTodo={props.toggleTodo} deleteTodo={props.deleteTodo} key={index} />
      })
    }
  </ul>
))

export default TodoMain
