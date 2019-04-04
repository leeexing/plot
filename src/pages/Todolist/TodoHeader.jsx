import React, { Component } from 'react'
import { Input } from 'antd'
import { connect } from 'react-redux'
import { addTodo } from '@/storeRedux/actions'

// -对比一下这个写法，还是不够简洁
// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     addTodo (data) {
//       dispatch(addTodo(data))
//     }
//   }
// }
const mapDispatchToProps = { addTodo }

@connect(null, mapDispatchToProps)
class TodoHeader extends Component {

  handleEnter (event) {
    if (event.target.value.trim()) {
      let data = {
        Name: event.target.value,
        isFinished: false
      }
      this.props.addTodo(data)
      event.target.value = ''
    }
  }

  render () {
    return (
      <div className="todo-header">
        <Input placeholder="Please input a new todo" onPressEnter={value => this.handleEnter(value)} />
      </div>
    )
  }
}

export default TodoHeader
