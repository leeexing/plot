import React, { Component } from 'react'
import { Card } from 'antd'
import { inject, observer } from 'mobx-react'
import TodoHeader from './TodoHeader'
import TodoList from './TodoList'
import TodoFooter from './TodoFooter'
import './todo.less'

@inject('todoStore')
@observer
class Todo extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    console.log(this.props.todoStore)
  }
  render () {
    return (
      <div className="m-todo">
        <Card
          title="Todo List"
          style={{width: '50%'}}
        >
          <TodoHeader addTodo={this.props.todoStore.addTodo}/>
          <TodoList todos={this.props.todoStore.todoList} toggleTodo={this.props.todoStore.toggleTodo} deleteTodo={this.props.todoStore.deleteTodo} />
          <TodoFooter/>
        </Card>
      </div>
    )
  }
}

export default Todo
