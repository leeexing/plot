/**
 * 权限验证
 */
import Cookies from 'js-cookie'

import { TOKEN_KEY } from '@/api/config'


class Token {
  static getToken() {
    return Cookies.get(TOKEN_KEY)
  }
  static setToken(token, expiresTime = 7) {
    return Cookies.set(TOKEN_KEY, token, {
      expires: expiresTime,
      path: '/'
    })
  }
  static setTokenNoRemenber() {
    return Cookies.set(TOKEN_KEY, token)
  }
  static removeToken() {
    return Cookies.remove(TOKEN_KEY)
  }
}

export default Token
