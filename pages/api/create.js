import createServicer from '@/services/create'

export async function createItem(payload) {

    const res = await createServicer.createItem(payload);
    return res.body.data;

}

export async function createMyCollection(payload) {

    const res = await createServicer.createMyCollection(payload);
    return res;

}


