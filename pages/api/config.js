import configService from '@/services/config'

export async function getPercent(payload) {
    const res = await configService.getPercent(payload);
    return res.body.percent;
}
