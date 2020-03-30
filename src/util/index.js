/**
 * 工具
 */

export const util = {
  getname() {
    return ''
  }
}

export const setProp = (key, value) => ({
  key: value
})

export const getUrlSearch = search => {
  let obj = {}
  let pairs = search.slice(1).split("&")
  for (let i = 0; i < pairs.length; i++) {
    let pos = pairs[i].indexOf('=')
    if (pos === -1) {
      continue
    }
    let name = pairs[i].substring(0, pos)
    let value = pairs[i].substring(pos + 1)
    obj[name] = value
  }
  return obj
}

export const calculateSize = size => {
  if (size < 1024) {
    return size + 'KB'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + 'M'
  }
  return (size / (1024 * 1024)).toFixed(1) + 'G'
}

export function kebabCase(s) {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}

export function getNowDate() {
  let now = new Date()
  let year = now.getFullYear()
  let month = String(now.getMonth() + 1)
  let date = now.getDate() + ''
  return `${year}-${month.padStart(2, 0)}-${date.padStart(2, 0)}`
}

export function secondsToStr(temp) {
  const years = Math.floor(temp / 31536000)
  if (years) {
    return years + ' year' + numberEnding(years)
  }
  const days = Math.floor((temp %= 31536000) / 86400)
  if (days) {
    return days + ' day' + numberEnding(days)
  }
  const hours = Math.floor((temp %= 86400) / 3600)
  if (hours) {
    return hours + ' hour' + numberEnding(hours)
  }
  const minutes = Math.floor((temp %= 3600) / 60)
  if (minutes) {
    return minutes + ' minute' + numberEnding(minutes)
  }
  const seconds = temp % 60
  return seconds + ' second' + numberEnding(seconds)

  function numberEnding(number) {
    return (number > 1) ? 's' : ''
  }
}

// 函数防抖
export const debounce = (f, wait = 100, immediate) => {
  let context, timer
  return function (...args) {
    context = this
    timer && clearTimeout(timer)
    if (immediate) {
      let callNow = !timer
      timer = setTimeout(() => {
        f.apply(context, args)
      }, wait)
      callNow && f.apply(context, args)
    } else {
      timer = setTimeout(() => {
        f.apply(context, args)
      }, wait)
    }
  }
}
