import assetService from '@/services/asset'

export async function getListItem(payload) {
    const res = await assetService.getListItem(payload)
    return res.body
}

export async function getMyAsset(payload) {
    const res = await assetService.getMyAsset(payload)
    return res.body.data
}

export async function getMyCreated(payload) {
    const res = await assetService.getMyCreated(payload)
    return res.body.data
}
  
export async function getMyFavorited(payload) {
    const res = await assetService.getMyFavorited(payload)
    return res.body.data
}

export async function getMyResell(payload) {
    const res = await assetService.getMyResell(payload)
    return res.body.data
}

 