import request from './request'

const detailService = {
    
    getDetailItem: payload => {
        return request.getWithAccessToken(`/items/${payload.id}`, {}, payload.req, payload.res)
    },
    
    getMoreFromCollection: payload => {
        return request.get('/items', payload);
    },
    
    getDetailNtfBlock: payload => {
        return request.get(`/itemnft-by-id/${payload.id}`);
    },

    buyItem: payload => {
        return request.put(`/buy-item/${payload.id}`);
    },

    reSellItem: payload => {
        return request.put(`/resell-item/${payload.id}`, payload.data);
    },

}

export default detailService;