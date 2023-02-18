import userService  from '@/services/user'

export async function getInfoUser(payload) {
    const res = await userService.getInfoUser(payload);
    return res.body.data;
}

export async function getProfileById(payload) {
    const res = await userService.getProfileById(payload);
    return res.body.data;
}

export async function updateProfile(payload) {
    const res = await userService.updateProfile(payload);
    return res;
}


