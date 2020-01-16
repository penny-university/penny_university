import * as ActionTypes from '../actions'
import paginate from './paginate'
import {combineReducers} from 'redux'
import merge from 'lodash/merge'

// Updates an entity cache in response to any action with response.entities.
const entities = (state = { chats: {} }, action) => {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities)
  }

  return state
}

const pagination = combineReducers({
  chatsByFilter: paginate({
    mapActionToKey: action => 'all',
    types: [
      ActionTypes.CHATS_REQUEST,
      ActionTypes.CHATS_SUCCESS,
      ActionTypes.CHATS_FAILURE
    ]
  })
})

const rootReducer = combineReducers({
  entities,
  pagination
})

export default rootReducer