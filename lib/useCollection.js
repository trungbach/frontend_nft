import useSWR, {useSWRInfinite}  from 'swr';
import {getItemByCategory, getCollectionByName} from '@/pages/api/collection' 

export const useCollection = (url) => {
    const {data, error} = useSWR(url, getItemByCategory)
    return {data, error}
}

export const useFilterCollection = (url, listCollection) => {
    const {data, error} = useSWR(url, getCollectionByName, {initialData: listCollection})
    return {filterCollection: data, error}
}