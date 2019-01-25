/**
 * 工具
*/

export const util = {
  getname () {
    return ''
  }
}

export function kebabCase (s) {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}
