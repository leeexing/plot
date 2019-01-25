/**
 * 项目重要配置参数
 */
const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5280' : 'http://10.15.225.16:5280'
const TOKEN_KEY = 'c291cmNlLWRhdGEtdG9rZW4tMjAxOA==' // new Buffer('source-data-token-2018').toString('base64)

export {
  baseURL,
  TOKEN_KEY
}
