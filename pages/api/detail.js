import detailService from '@/services/detail'

export async function getDetailItem(payload) {
    const res = await detailService.getDetailItem(payload)
    return res.body
}

export async function getMoreFromCollection(payload) {
    const res = await detailService.getMoreFromCollection(payload);
    return res.body.data;
}

export async function getDetailNtfBlock(payload) {
    const res = await detailService.getDetailNtfBlock(payload);
    return res.body.data;
}

export async function buyItem(payload) {
    const res = await detailService.buyItem(payload);
    return res.body.data;
}

export async function reSellItem(payload) {
    const res = await detailService.reSellItem(payload);
    return res.body.data;
}

