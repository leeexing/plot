/**
 * 项目重要配置参数
 */
const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5281' : 'http://stgplotapi.anjianba.cn:5281'
const TOKEN_KEY = 'source_data_ols_token'
window.localStorage.setItem('app_api_url', baseURL + '/v1/')

export {
  baseURL,
  TOKEN_KEY
}
