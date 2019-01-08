/**
 * 权限验证
 */
import Cookies from 'js-cookie'
import {TOKEN_KEY} from '@/api/config'

class Token {
  static getToken () {
    return Cookies.get(TOKEN_KEY)
  }
  static setToken (token) {
    return Cookies.set(TOKEN_KEY, token, {expires: 1, path: '/'})
  }
  static removeToekn () {
    return Cookies.remove(TOKEN_KEY)
  }
}

export default Token
