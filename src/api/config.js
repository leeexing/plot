/**
 * 项目重要配置参数
 */
const baseUrlMap = {
  test: 'https://stgplotapi.anjianba.cn',
  development: 'http://localhost:5281',
  production: 'https://plotapi.anjianba.cn'
}
const signalrUrlMap = {
  test: 'https://stgws.anjianba.cn/browser',
  development: 'https://stgws.anjianba.cn/browser',
  production: 'https://ws.anjianba.cn/browser'
}

const TOKEN_KEY = 'source_data_ols_token'
const baseURL = baseUrlMap[process.env.BUILD_TYPE]
const SIGNALR_URL = signalrUrlMap[process.env.BUILD_TYPE]

window.localStorage.setItem('app_api_url', baseURL + '/v1/')

export {
  baseURL,
  TOKEN_KEY,
  SIGNALR_URL
}
