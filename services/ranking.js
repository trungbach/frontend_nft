import request from './request'

const rankingService =  {

    getRankingCollection: payload => {
        return request.get('/collections-rankings', payload)
    },

    getRankingUser: payload => {
        return request.get('/users-rankings', payload)
    },
    
}

export default rankingService