import request from './request'

const loginService = {

    checkPublicAddress: payload => {
        return request.post('/check_public_address', payload);
    },

    verifySignature: payload => {
        return request.post('/signature_verification_address', payload);
    }
}

export default loginService;