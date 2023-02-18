import { actionTypes } from './action'
import cookie from 'js-cookie'

const initialState = {
  isLoggedIn: cookie.get('token') === undefined ? false : true,
  user: cookie.get('user') !== undefined ? JSON.parse(cookie.get('user')) : undefined,
  isOpenWallet: false
}

export default function reducer(state = initialState, action) {

  switch (action.type) {
    case actionTypes.LOGIN: 
    cookie.set('token', action.payload.token, {expires: 1})
    cookie.set('user', JSON.stringify(action.payload.user), {expires: 1} )
      return {...state, isLoggedIn: true, user: JSON.parse(cookie.get('user'))}

    case actionTypes.LOGOUT:
      cookie.remove('token')
      cookie.remove('user')
      return {...state, isLoggedIn: false, user: undefined}

    case actionTypes.UPDATE_PROFILE:
      cookie.set('user', JSON.stringify(action.payload))
      return {...state, user: action.payload}

    case actionTypes.OPEN_WALLET:
      return {...state, isOpenWallet: true}
    
    case actionTypes.TOGGLE_WALLET:
      return {...state, isOpenWallet: !state.isOpenWallet}

    default:
      return state
  }
  
}
