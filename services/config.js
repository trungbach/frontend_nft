import request from './request'

const configService =  {

    getPercent: () => {
        return request.get('/public/config.json')
    },

}

export default configService