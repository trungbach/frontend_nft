import request from './request'

const collectionService =  {
    getListCollection: payload => {
        return request.get('/collections', payload)
    },

    getCollectionBySlug: payload => {
        return request.get(`/collections/${payload.id}`);
    },

    getItemByCategory: payload => {
        return request.get('/items', payload);
    },

    getMyCollection: payload => {
        return request.getWithAccessToken('/my-collections', {}, payload.req, payload.res);
    },

    editMyCollection: payload => {
        return request.put(`/collections/${payload.id}`, payload.data);
    },

    getCollectionByName: payload => {
        return request.get('/collections', payload);
    }
}

export default collectionService