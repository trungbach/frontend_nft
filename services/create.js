import request from './request'


const createService =  {
    createItem: payload => {
        return request.post('/items', payload)
    },

    createMyCollection: payload => {
        return request.post('/collections', payload)
    },
}

export default createService