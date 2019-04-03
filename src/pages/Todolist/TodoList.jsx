import React, { Component } from 'react'
import { Button, Checkbox } from 'antd'
import { connect } from 'react-redux'
import { isEmpty } from 'ramda'

import { setTodolist, toggleTodo, deleteTodo } from '@/storeRedux/actions'

const mapStateToProps = state => {
  return {
    todolist: state.todolist,
    filterType: state.filterType
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setTodolist (data) {
      dispatch(setTodolist(data))
    },
    toggleTodo (data) {
      dispatch(toggleTodo(data))
    },
    deleteTodo (data) {
      dispatch(deleteTodo(data))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class TodoList extends Component {

  componentDidMount () {
    this.props.setTodolist()
  }

  onChange = (id) => {
    this.props.toggleTodo(id)
  }

  onDelete (id) {
    this.props.deleteTodo(id)
  }

  getTodos (todos) {
    let { filterType } = this.props
    return todos.filter(item => {
      switch (filterType) {
        case 'ALL':
          return item
        case 'DONE':
          return item.isFinished
        case 'NOT_DONE':
          return !item.isFinished
        default:
          return item
      }
    })
  }

  render () {
    let { todolist } = this.props
    todolist = this.getTodos(todolist)
    return (
      <div className="todo-list">
        {isEmpty(todolist)
          ? <div className="todo-none">暂无Todo</div>
          : todolist.map((item, index) => (
            <div className="todo-item" key={index}>
              <Checkbox checked={item.isFinished} onChange={this.onChange.bind(null, item.ID)} />
              <span>{item.Name}</span>
              <div className="todo-opr">
                {/* <Button size="small">完成</Button> */}
                <Button size="small" onClick={this.onDelete.bind(this, item.ID)}>删除</Button>
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}

export default TodoList
