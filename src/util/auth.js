/**
 * 权限验证
 */
import Cookies from 'js-cookie'
import {TOKEN_KEY} from '@/api/config'

class Token {
  static getToken (key=TOKEN_KEY) {
    return Cookies.get(key)
  }
  static setToken (token, key=TOKEN_KEY) {
    return Cookies.set(key, token, {expires: 7, path: '/'})
  }
  static setTokenNoRemenber () {
    return Cookies.set(key, token)
  }
  static removeToken (key=TOKEN_KEY) {
    return Cookies.remove(key)
  }
}

export default Token
