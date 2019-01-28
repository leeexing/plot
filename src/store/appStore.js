/**
 * 项目状态
 */
import { action, computed, observable } from 'mobx'

class AppStore {
  @observable menuShrink = false
  @observable isUploaderInsert = false
  @observable isUploaderClose = true
  @observable isUploaderMini = false

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

  @action('文件上传切换到全局模式')
  toggleUploaderGlobal = value => {
    this.isUploaderInsert = value
  }

  @action('上传组件全换到页面中')
  uploaderChange2Imagepage = () => {
    this.isUploaderInsert = false
    this.isUploaderClose = false
    this.isUploaderMini = false
  }

  @action('上传组件最小化')
  toggleUploaderMini = value => {
    this.isUploaderMini = value
  }

  @action('关闭上传组件')
  closeUploader = () => {
    this.isUploaderClose = true
  }

}

export default AppStore
