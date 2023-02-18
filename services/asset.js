import request from "./request"

const assetService = {

    getListItem: payload => {
        return request.get('/items', payload)
    },

    getMyAsset: payload => {
        return request.get('/my-assets-items', payload)
    },

    getMyCreated: payload => {
        return request.get('/my-created-items', payload)
    },

    getMyFavorited: payload => {
        return request.get('/favorite-items', payload)
    }, 

    getMyResell: payload => {
        return request.get('/my-resell-items', payload)
    }

}

export default assetService;