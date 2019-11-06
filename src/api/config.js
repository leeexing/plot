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
const uploadUrlMap = {
  test: 'https://stgplotapi.anjianba.cn/v1/uploadApi/upload/file',
  development: 'http://localhost:5284/v1/uploadApi/upload/file',
  production: 'https://plotapi.anjianba.cn/v1/uploadApi/upload/file',
}

const TOKEN_KEY = 'source_data_ols_token'
const BASE_URL = baseUrlMap[process.env.BUILD_TYPE] + '/v1'
const SIGNALR_URL = signalrUrlMap[process.env.BUILD_TYPE]
const UPLOAD_URL = uploadUrlMap[process.env.BUILD_TYPE]

window.localStorage.setItem('app_api_url', BASE_URL)

export {
  BASE_URL,
  TOKEN_KEY,
  SIGNALR_URL,
  UPLOAD_URL
}
