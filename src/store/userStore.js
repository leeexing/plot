import {
  computed,
  observable,
  action
} from 'mobx'

import Auth from '@/util/auth'


// 要想在这里获取其他store的状态，可以创建一个constructor，然后将 Store 中的 this 传进来
class UserStore {
  @observable username = localStorage.getItem('username') || ''
  @observable avatar = localStorage.getItem('avatar') || ''
  @observable isLogined = false || !!Auth.getToken()
  @observable enterpriseCode = localStorage.getItem('enterpriseCode') || ''

  @computed get getUsername() {
    return this.username
  }

  @action
  login = (userInfo) => {
    this.username = userInfo.username
    this.avatar = userInfo.avatar
    this.isLogined = true
    this.enterpriseCode = userInfo.enterpriseCode
    localStorage.setItem('username', userInfo.username)
    localStorage.setItem('avatar', userInfo.avatar || '')
    localStorage.setItem('signalrToken', userInfo.signalrToken)
    localStorage.setItem('enterpriseCode', userInfo.enterpriseCode)
  }

  @action('退出登录')
  logout = () => {
    this.isLogined = false
    Auth.removeToken()
    localStorage.setItem('username', null)
    localStorage.setItem('avatar', null)
    localStorage.setItem('signalrToken', null)
    localStorage.setItem('enterpriseCode', null)
  }
}

export default UserStore