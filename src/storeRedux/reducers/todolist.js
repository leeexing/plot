import defaultState from '../state'

export function todolist (state = defaultState.todolist, action) {
  switch (action.type) {
    case 'SET_TODO_LIST':
      return action.data

    case 'ADD_TODO':
      return [...state, action.data]

    case 'TOGGLE_TODO':
      state = state.map((item, index) => {
        if (item.ID === action.data) {
          item.isFinished = !item.isFinished
        }
        return item
      })
      return state

    case 'DELETE_TODO':
      state.splice(action.data, 1)
      return state

    default:
      return state
  }
}

export function filterType (state = defaultState.filterType, action) {
  switch (action.type) {
    case 'SET_FILTER_TYPE':
      return action.data

    default:
      return state
  }
}
