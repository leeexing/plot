/**
 * 项目重要配置参数
 */
const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5281' : 'https://stgplotapi.anjianba.cn'
const TOKEN_KEY = 'source_data_ols_token'
const SIGNALR_URL = 'https://stgws.anjianba.cn/browser'

window.localStorage.setItem('app_api_url', baseURL + '/v1/')

export {
  baseURL,
  TOKEN_KEY,
  SIGNALR_URL
}
