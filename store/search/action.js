export const actionTypes = {
  SEARCH_CATEGORY: 'SEARCH_CATEGORY',
  SET_TYPE: 'SET_TYPE',
 
}

export const searchCategory = (payload) => {
  return { type: actionTypes.SEARCH_CATEGORY, payload }
}

export const setType = (payload) => {
  return { type: actionTypes.SET_TYPE, payload }
}
