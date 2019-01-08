/**
 * 项目状态
 */
import { action, computed, observable } from 'mobx'

class AppStore {
  @observable menuShrink = false

  constructor (rootStore) {
    this.rootStore = rootStore
  }

  @computed get username () {
    return this.rootStore.userStore.username
  }

  @action('切换菜单栏状态')
  toggleMenubar = () => {
    console.log(this.menuShrink, '+++')
  }
}

export default AppStore
