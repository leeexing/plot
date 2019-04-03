import React from 'react'
import TodoHeader from './TodoHeader'
import TodoFooter from './TodoFooter'
import TodoList from './TodoList'
import './style.less'

function Todo () {
  return (
    <div className="todo">
      <div className="todo-wrapper">
        <TodoHeader />
        <TodoList />
        <TodoFooter />
      </div>
    </div>
  )
}

export default Todo
