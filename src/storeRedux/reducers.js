import { combineReducers } from 'redux'
import defaultState from './state'

function pageTitle (state = defaultState.pageTitle, action) {
  switch (action.type) {
    case 'SET_PAGE_TITLE':
      return action.data

    default:
      return state
  }
}

function infoList (state = defaultState.infoList, action) {
  switch (action.type) {
    case 'SET_INFO_LIST':
      return action.data

    case 'UPDATE_INFO_LIST':
      return action.data

    default:
      return state
  }
}

export default combineReducers({
  pageTitle,
  infoList
})
