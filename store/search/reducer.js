import { actionTypes } from './action'

const initialState = {
  categoryId: '',
  type: ''
}

export default function reducer(state = initialState, action) {

  switch (action.type) {
    case actionTypes.SEARCH_CATEGORY: 
      return {...state, categoryId: action.payload }
    case actionTypes.SET_TYPE: 
      return {...state, type: action.payload }
    default:
      return state
  }
  
}
