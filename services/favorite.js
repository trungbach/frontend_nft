import request from './request'

const favoriteService = {
    
    createFavorite: payload => {
        return request.post(`/create-favorites`, payload);
    },
    
    deleteFavorite: payload => {
        return request.post('/delete-favorites', payload);
    },

    getMostFavorite: payload => {
        return request.get('/most-favorite-item', payload);
    },
    
}

export default favoriteService;