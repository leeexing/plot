import UserStore from './userStore'
import TodoStore from './todoStore'
import AppStore from './appStore'

class RootStore {
  constructor () {
    this.userStore = new UserStore()
    this.todoStore = new TodoStore()
    this.appStore = new AppStore(this)
  }
}

export default new RootStore()
