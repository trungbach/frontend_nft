import styles from '../styles/Home.module.css'
import {getListCategory} from '@/pages/api/category'
import {getMostFavorite} from '@/pages/api/favorite'
import {getRankingCollection} from '@/pages/api/ranking'
import {DATE_TIME} from '@/config/constants'
import moment from 'moment'
import {useRankingCollection} from '@/lib/useRanking'
import {useState} from 'react';
import dynamic from 'next/dynamic'
import Banner from '@/components/HomeFeature/Banner'

const Footer = dynamic(() => import('@/components/Footer'))
const FeatureCategory = dynamic(() => import('@/components/HomeFeature/FeatureCategory'))
const FeatureTrending = dynamic(() => import('@/components/HomeFeature/FeatureTrending'))

export default function Home({listCategory, mostFavoriteItem, rankingCollection}) {
  const rangeTime= [ moment().subtract(7, 'day').format(DATE_TIME), moment().format(DATE_TIME) ]
  const [categoryId, setCategoryId] = useState('')
  const { collectionRanking } = useRankingCollection(`start_time=${rangeTime[0]}&end_time=${rangeTime[1]}&category_id=${categoryId}`, rankingCollection)

  const listFeatureCategory = listCategory.map((item, index) => {
    return (
      <FeatureCategory key={index} category={item} />
    )
  })

  return (
    <>

      <div className={styles.content}>
        <Banner mostFavoriteItem={mostFavoriteItem} />
        <FeatureTrending rankingCollection={collectionRanking} setCategoryId={setCategoryId} listCategory={listCategory}/>
        {listFeatureCategory}
      </div>
      <Footer />
    </>

  )
}

export async function getStaticProps() {

  const listCategory = await getListCategory();
  const mostFavoriteItem = await getMostFavorite();

  const rangeTime= [ moment().subtract(7, 'day').format(DATE_TIME), moment().format(DATE_TIME) ]
  const rankingCollection = await getRankingCollection(`start_time=${rangeTime[0]}&end_time=${rangeTime[1]}`);
  return {
      props: {
         listCategory, 
         mostFavoriteItem: mostFavoriteItem || null,
         rankingCollection,
      },
      revalidate: 180
  }
}