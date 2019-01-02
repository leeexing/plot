import { observable, action, computed } from 'mobx'

class AppStore {
  @observable todos = []

  @computed getTodos () {
    return this.todos
  }

  @action addTodo (todo) {
    this.todos.push(todo)
  }
}

export default AppStore
