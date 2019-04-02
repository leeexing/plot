import api from '@/api'

export function setPageTitle (data) {
  return {type: 'SET_PAGE_TITLE', data} // 不是异步的可以直接返回一个对象
  // return (dispatch, getState) => {
  //   dispatch({type: 'SET_PAGE_TITLE', data})
  // }
}

export function setInfoList (data) {
  return (dispatch, getState) => {
    api.fetchTodos().then(res => {
      console.log('state:', getState())
      // console.log(res)
      dispatch({type: 'SET_INFO_LIST', data: res.data.tenements})
    })
  }
}

export function updateInfoList (data) {
  return ((dispatch, getState) => {
    api.fetchPictureList().then(res => {
      // console.log(res)
      let data = res.data.pictures.map(item => {item.Name = item.url; return item})
      dispatch({type: 'UPDATE_INFO_LIST', data})
    })
  })
}
