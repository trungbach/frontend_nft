export const actionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  OPEN_WALLET: 'OPEN_WALLET',
  TOGGLE_WALLET: 'TOGGLE_WALLET',
  UPDATE_PROFILE: 'UPDATE_PROFILE'
}

export const loginAccount = (payload) => {
  return { type: actionTypes.LOGIN, payload }
}

export const logoutAccount = () => (dispatch) => {
  return dispatch({ type: actionTypes.LOGOUT })
}

export const openWallet = () => (dispatch) => {
  return dispatch({ type: actionTypes.OPEN_WALLET })
}

export const toggleWallet = () => (dispatch) => {
  return dispatch({ type: actionTypes.TOGGLE_WALLET })
}

export const editProfile = (payload) =>  {
  return { type: actionTypes.UPDATE_PROFILE, payload }
}
