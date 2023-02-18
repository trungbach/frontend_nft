import useSWR, {useSWRInfinite}  from 'swr';
import {getRankingCollection, getRankingUser} from '@/pages/api/ranking';

export const useRankingCollection = (url, rankingCollection) => {
    const {data, error} = useSWR(url, getRankingCollection, {initialData: rankingCollection})
    return {collectionRanking: data, error}
}

export const useRankingUser = (url, rankingUser) => {
    const {data, error} = useSWR(url, getRankingUser, {initialData: rankingUser})
    return {userRanking: data, error}
}
