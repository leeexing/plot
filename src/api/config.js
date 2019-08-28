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
// 按理应该使用nginx配置，反向代理统一到一个端口下面
const UPLOAD_URL = process.env.BUILD_TYPE !== 'development'
                    ? baseURL + '/v2/api/upload/file'
                    : 'http://127.0.0.1:5284/v1/uploadApi/upload/file'

window.localStorage.setItem('app_api_url', baseURL + '/v1/')

export {
  baseURL,
  TOKEN_KEY,
  SIGNALR_URL,
  UPLOAD_URL
}
