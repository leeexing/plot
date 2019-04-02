/**
 * 项目重要配置参数
 */
const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5280' : 'http://10.15.225.16:5280'
const TOKEN_KEY = 'source-data-ols-token'
const HOST = ''

export {
  baseURL,
  HOST,
  TOKEN_KEY
}
