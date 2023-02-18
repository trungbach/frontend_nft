import useSWR, {useSWRInfinite}  from 'swr';
import {getListItem,} from '@/pages/api/asset' 

export const useAsset = (url) => {
    const {data, error} = useSWR(url, getListItem)
    return {data: data?.data, total_items: data?.total_items, error}
    
}


// export const useAssetInfinite =  (queryKey, initialData) => {
//     const {data, error} = useSWRInfinite(
//         (pageIndex, previousPageData) => {
//             //reached the end
//             if(previousPageData && !previousPageData.after) return null;
//             // next pages 
//             return `${queryKey}&page=${pageIndex}`
//         }
//     )

//     return {data, error}
// }

// export default function useInfiniteAsset(queryKey) {
//     const { data, error, size, setSize } = useSWRInfinite(

//       (pageIndex, previousPageData) => {

//         if (previousPageData && !previousPageData.after) return null;

//         return `${queryKey}&page=${pageIndex}`;
//       },
//       getListItem,
//     );
  
//     const fetchNextPage = () => setSize(size => size + 1);
  
//     const flattenPages = data?.flatMap(page => page.data) ?? [];
//     const hasNextPage = Boolean(data?.[size - 1]?.after);
//     const isFetchingInitialData = !data && !error;
//     const isFetchingNextPage =
//       isFetchingInitialData ||
//       (size > 0 && data && typeof data[size - 1] === 'undefined');
  
//     return {
//       data: flattenPages,
//       error,
//       hasNextPage,
//       fetchNextPage,
//       isFetchingInitialData,
//       isFetchingNextPage,
//     };
//   }

