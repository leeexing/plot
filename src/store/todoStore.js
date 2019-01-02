import { computed, observable, action, runInAction } from 'mobx'
import api from '@/api'

class TodoStore {
  @observable todos = [
    {
      id: 1,
      title: '元旦放假结束后第一天工作',
      isFinished: false
    }
  ]

  @computed get remainingTodos () {
    return this.todos.filter(item => !item.isFinished).length
  }

  @computed get isAllChecked () {
    return this.todos.filter(item => item.isFinished).length === this.todos.length
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

  // -异步处理逻辑
  @action
  getTodos () {
    api.fetchTodos().then(action('获取todos列表', res => {
      console.log(res)
      let newTodos = res.data.tenements.map(item => {
        let obj = {
          id: Math.random(),
          title: item.Name,
          isFinished: false
        }
        return obj
      })
      console.log(newTodos)
      this.todos = [...this.todos, ...newTodos]
    }))
  }

  // -新式的写法
  @action
  fetchAsyncTodos = async () => {
    let data = await api.fetchTodos()
    runInAction('更新todos列表', () => {
      this.todos = data.data.tenements.map(item => {
        let obj = {
          id: Math.random(),
          title: item.Name,
          isFinished: false
        }
        return obj
      })
    })
  }
}

export default TodoStore
