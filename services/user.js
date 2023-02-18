import request from './request'

const userService =  {

    getInfoUser: payload => {
        return request.post('/check_public_address', payload)
    },

    getProfileById: payload => {
        return request.get(`/get-profile-buy-id/${payload.id}`)
    },

    updateProfile: payload => {
        return request.post('/update-profile', payload)
    },
}

export default userService