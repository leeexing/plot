import api from '@/api'

export function setTodolist (data) { // 涉及到获取数据，需要异步处理
  return (dispatch, getState) => {
    api.fetchTodos().then(res => {
      console.log(res)
      dispatch({type: 'SET_TODO_LIST', data: res.data.tenements})
    })
  }
}

export function toggleTodo (data) {
  return {type: 'TOGGLE_TODO', data}
}

export function deleteTodo (data) {
  return {type: 'DELETE_TODO', data}
}

export function addTodo (data) {
  return {type: 'ADD_TODO', data}
}

export function setFilterType (data) {
  return {type: 'SET_FILTER_TYPE', data}
}