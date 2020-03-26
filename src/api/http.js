/**
 * 封装http请求
 */
import qs from 'qs'
import axios from 'axios'
import { message } from 'antd'

import Auth from '@/util/auth'
import { BASE_URL as baseURL } from './config'
import { BrowserRouter } from 'react-router-dom'


const router = new BrowserRouter()
const routeSkip = path => {
  router.history.push(path)
  router.history.go()
}

// !创建axios实例
const service = axios.create({
  baseURL,
  timeout: 8000
})

// !请求拦截
service.interceptors.request.use(config => {
  // FIXME:这种做法太不安全了.通过nginx配置
  // if (config.url.includes('uploadApi')) {
  //   config.baseURL = config.baseURL.replace('5381', '5384')
  // }
  let userTicket = Auth.getToken()
  if (userTicket) {
    config.headers.Authorization = `Bearer ${Auth.getToken()}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// !响应拦截
service.interceptors.response.use(response => {
  let msg = response.data.msg || response.data.error
  if (!response.data.result) {
    message.warning(msg)
    return Promise.reject(response.data)
  }
  return response
}, error => {
  let originalRequest = error.config
  // -请求超时，只能再请求一次
  if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1 && !originalRequest._retry) {
    originalRequest._retry = true
    console.error(error)
    // message.error('请求超时~')
    return axios.request(originalRequest)
  }
  if (error.response) {
    switch (error.response.status) {
      case 401:
        message.info('请重新登录！')
        setTimeout(() => {
          routeSkip('/login')
        }, 100)
        return Promise.reject(error.response)
      case 500:
        message.error('Server Error')
        // routeSkip('/500')
        return Promise.reject(error.response)
      default:
        return Promise.reject(error.response)
    }
  } else {
    message.error('请求超时')
    console.error(error)
  }
})

const CONTENT_TYPE_JSON = 'application/json'
const CONTENT_TYPE_FILE = 'multipart/form-data'
const CONTENT_TYPE_FORM = 'application/x-www-form-urlencoded;charset=utf-8'

export default {
  get(url, data = {}, options = {}) {
    let config = {
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: 'brackets'
        })
      },
      ...options
    }
    return new Promise((resolve, reject) => {
      service.get(url, config)
        .then(res => resolve(res.data))
        .catch(reject)
    })
  },
  post(url, data = {}, options = {}) {
    let contentType = CONTENT_TYPE_JSON
    switch (options.contentType) {
      case 'form':
        data = qs.stringify(data)
        contentType = CONTENT_TYPE_FORM
        break
      case 'file':
        contentType = CONTENT_TYPE_FILE
        break
      default:
        data = JSON.stringify(data)
        break
    }
    let config = {
      headers: {
        'Content-Type': contentType
      }
    }
    return new Promise((resolve, reject) => {
      service.post(url, data, config)
        .then(res => resolve(res.data))
        .catch(reject)
    })
  },
  put(url, data = {}, options = {}) {
    let contentType = CONTENT_TYPE_JSON
    if (options.contentType === 'form') {
      contentType = CONTENT_TYPE_FORM
      data = qs.stringify(data)
    } else {
      data = JSON.stringify(data)
    }
    let config = {
      headers: {
        'Content-Type': contentType
      }
    }
    return new Promise((resolve, reject) => {
      service.put(url, data, config)
        .then(res => resolve(res.data))
        .catch(reject)
    })
  },
  delete(url, data = {}, options = {}) {
    let contentType = CONTENT_TYPE_JSON
    if (options.contentType === 'form') {
      contentType = CONTENT_TYPE_FORM
      data = qs.stringify(data)
    }
    let config = {
      data,
      headers: {
        'Content-Type': contentType
      },
      ...options
    }
    return new Promise((resolve, reject) => {
      service.delete(url, config)
        .then(res => resolve(res.data))
        .catch(reject)
    })
  }
}
