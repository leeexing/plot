import UserStore from './userStore'
import AppStore from './appStore'

class Store {
  constructor () {
    this.userStore = new UserStore()
    this.todoStore = new AppStore()
  }
}

export default new Store()
