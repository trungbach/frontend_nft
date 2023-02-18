import favoriteService from '@/services/favorite'

export async function createFavorite(payload) {
    const res = await favoriteService.createFavorite(payload);
    return res.body.data;
}

export async function deleteFavorite(payload) {
    const res = await favoriteService.deleteFavorite(payload);
    return res.body.data;
}

export async function getMostFavorite(payload) {
    const res = await favoriteService.getMostFavorite(payload);
    return res.body.data;
}