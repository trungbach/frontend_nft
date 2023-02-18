import loginService from '@/services/login'

export async function checkPublicAddress(payload) {
    const res = await loginService.checkPublicAddress(payload);
    return res.body.data;
}

export async function verifySignature(payload) {
    const res = loginService.verifySignature(payload);
    return res;
}
