/**
 * 项目重要配置参数
 */
const baseUrlMap = {
  development: 'http://localhost:5281',
  // production: 'https://stgplotapi.anjianba.cn', // 其实是 测试环境
  production: 'https://plotapi.anjianba.cn'
}
const signalrUrlMap = {
  development: 'https://stgws.anjianba.cn/browser',
  // production: 'https://stgws.anjianba.cn/browser', // 其实是 测试环境
  production: 'https://debug.anjianba.cn:8080/browser'
}

const TOKEN_KEY = 'source_data_ols_token'
const baseURL = baseUrlMap[process.env.NODE_ENV]
const SIGNALR_URL = signalrUrlMap[process.env.NODE_ENV]

window.localStorage.setItem('app_api_url', baseURL + '/v1/')

export {
  baseURL,
  TOKEN_KEY,
  SIGNALR_URL
}
