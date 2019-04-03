import defaultState from '../state'

export function pageTitle (state = defaultState.pageTitle, action) {
  switch (action.type) {
    case 'SET_PAGE_TITLE':
      return action.data

    default:
      return state
  }
}

export function infoList (state = defaultState.infoList, action) {
  switch (action.type) {
    case 'SET_INFO_LIST':
      return action.data

    case 'UPDATE_INFO_LIST':
      return action.data

    default:
      return state
  }
}
