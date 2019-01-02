import UserStore from './userStore'
import TodoStore from './todoStore'

class Store {
  constructor () {
    this.userStore = new UserStore()
    this.todoStore = new TodoStore()
  }
}

export default new Store()
