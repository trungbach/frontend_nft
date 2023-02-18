import request from './request'

const categoryService = {
    getProduct: payload => {
        return request.get('/posts', payload);
    },
    
    getListCategory: payload => {
        return request.get('/categories', payload);
    },

    getCategoryBySlug: payload => {
        return request.get(`/categories/${payload.id}`)
    }
}

export default categoryService;