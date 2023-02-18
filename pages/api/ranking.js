import rankingService from '@/services/ranking'

export async function getRankingCollection(payload) {
    const res = await rankingService.getRankingCollection(payload);
    return res.body.data;
}

export async function getRankingUser(payload) {
    const res = await rankingService.getRankingUser(payload);
    return res.body.data;
}

