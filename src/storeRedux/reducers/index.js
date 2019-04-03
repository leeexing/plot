import { combineReducers } from 'redux'
import * as pageinfoReducers from './pageinfo'
import * as todolistReducers from './todolist'

export default combineReducers({
  ...pageinfoReducers,
  ...todolistReducers
})
