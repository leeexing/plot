/**
 * 项目状态
 */
import { action, computed, observable } from 'mobx'

class AppStore {
  @observable menuShrink = false
  @observable isUploadShow = false
  @observable isUploaderClose = true
  @observable isUploaderMini = false

  @observable navBreadcrumbRouters = JSON.parse(localStorage.getItem('navbreads')) || [{
    path: 'home',
    name: '首页'
  }]

  constructor (rootStore) {
    this.rootStore = rootStore
  }

  @computed get username () {
    return this.rootStore.userStore.username
  }

  // !菜单

  @action('切换菜单栏状态')
  toggleMenubar = () => {
    console.log(this.menuShrink, '+++')
  }

  // !面包屑

  @action('动态更改面包屑')
  updateNavBreadcrumb = (route, multi=false) => {
    if (route.some(item => item.path === 'home')) {
      this.navBreadcrumbRouters.splice(1)
      localStorage.setItem('navbreads', JSON.stringify(this.navBreadcrumbRouters.toJS()))
      return
    }
    if (multi) {
      this.navBreadcrumbRouters.concat(route)
      localStorage.setItem('navbreads', JSON.stringify(this.navBreadcrumbRouters.toJS()))
    } else {
      this.navBreadcrumbRouters = this.navBreadcrumbRouters.slice(0, 1).concat(route)
      localStorage.setItem('navbreads', JSON.stringify(this.navBreadcrumbRouters.toJS()))
    }
  }

  // !上传组件

  @action('文件上传切换到全局模式')
  toggleUploaderGlobal = value => {
    this.isUploadShow = value
  }

  @action('上传组件最小化')
  toggleUploaderMini = value => {
    this.isUploaderMini = value
  }

}

export default AppStore
