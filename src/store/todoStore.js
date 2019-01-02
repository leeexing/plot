import { observable, action, computed } from 'mobx'

class TodoStore {
  @observable todos = [
    {
      id: 1,
      title: '元旦放假结束后第一天工作',
      isFinished: false
    }
  ]

  @computed get todoList () {
    return this.todos
  }

  @computed get remainingTodos () {
    return this.todos.filter(item => !item.isFinished).length
  }

  @action.bound
  toggleTodo (item) {
    item.isFinished = !item.isFinished
  }

  @action.bound
  addTodo (todo) {
    console.log(this, todo)
    this.todos.push(todo)
  }

  @action('删除待办事项')
  deleteTodo = (id) => {
    let index = this.todos.findIndex(item => item.id === id)
    console.log(index)
    this.todos.splice(index, 1)
  }

  @action('清除所有代办事项')
  clearTodos = () => {
    console.log(this)
    this.todos.length = 0
  }

  @action('待办事项全部完成')
  finishAllTodos = () => {
    this.todos.forEach(item => (item.isFinished = true))
  }
}

export default TodoStore
