import { computed, observable, action } from 'mobx'

// 要想在这里获取其他store的状态，可以创建一个constructor，然后将 Store 中的 this 传进来
class UserStore {
  @observable username = ''
  @observable avatar = ''
  @observable isLogined = false

  @computed get getUsername () {
    return this.username
  }

  @action
  login = (userInfo) => {
    console.log(userInfo)
  }

  @action('退出登录')
  logout = () => {

  }
}

export default UserStore
