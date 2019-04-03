/**
 * NOTE:
 * 使用了combineReducers之后，state的键值可能会改变，要看 reducers 是否还和state.js里面的键值保持一致
*/
import { combineReducers } from 'redux'
import * as pageinfoReducers from './pageinfo'
import * as todolistReducers from './todolist'

export default combineReducers({
  ...pageinfoReducers,
  ...todolistReducers
})
