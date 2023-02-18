import React, {useState, useEffect} from 'react';
import Image from 'next/image'
import styles from './style.module.scss'
import moment from 'moment'
import {useRankingUser, useRankingCollection} from '@/lib/useRanking'
import {getRankingCollection, getRankingUser} from '@/pages/api/ranking'
import {DATE_TIME} from '@/config/constants'
import dynamic from 'next/dynamic'
import avatarUser from '@/public/avatarUser.png'
import Link from 'next/link'
import superagent from 'superagent'
const Footer = dynamic(() => import('@/components/Footer'))

export async function getStaticProps() {

  const rangeTime= [ moment().subtract(7, 'day').format(DATE_TIME), moment().format(DATE_TIME) ]
  const rankingCollection = await getRankingCollection(`start_time=${rangeTime[0]}&end_time=${rangeTime[1]}`);
  const rankingUser = await getRankingUser(`start_time=${rangeTime[0]}&end_time=${rangeTime[1]}`);

  return {
    props: {
      rankingCollection,
      rankingUser
    },
    revalidate: 60
  }
}

const Rankings = ({ rankingCollection, rankingUser }) => {
    const [rangeTime, setRangeTime] = useState([ moment().subtract(7, 'day').format(DATE_TIME), moment().format(DATE_TIME) ])
    const [rangeTimeUser, setRangeTimeUser] = useState([ moment().subtract(7, 'day').format(DATE_TIME), moment().format(DATE_TIME) ])

    const { userRanking } = useRankingUser(`start_time=${rangeTimeUser[0]}&end_time=${rangeTimeUser[1]}`, rankingUser)
    const { collectionRanking } = useRankingCollection(`start_time=${rangeTime[0]}&end_time=${rangeTime[1]}`, rankingCollection)
    const [timeCollector, setTimeCollector] = useState(1)
    const [timeUser, setTimeUser] = useState(1)
    const [ETHPrice, setETHPrice] = useState()

    useEffect(() => {

      const getPriceETH = async() => {
        const res = await superagent.get('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT');
        setETHPrice(res.body.lastPrice)
      }

      getPriceETH()
    }, [])

    const lastTime = {
      LAST_DAY: 0,
      LAST_WEEK: 1,
      LAST_MONTH: 2
    }

    const handleChangeTimeCreator = (value) => {
      setTimeUser(value)
      switch (value) {
        case lastTime.LAST_DAY: 
          setRangeTimeUser([ moment().subtract(1, 'day').format(DATE_TIME), moment().format(DATE_TIME) ]) 
          break;
        case lastTime.LAST_WEEK: 
          setRangeTimeUser([ moment().subtract(7, 'day').format(DATE_TIME), moment().format(DATE_TIME) ]) 
          break;
        case lastTime.LAST_MONTH: 
          setRangeTimeUser([ moment().subtract(30, 'day').format(DATE_TIME), moment().format(DATE_TIME) ]) 
          break;
        default: 
          break
      }
    }

    const handleChangeTimeCollector = (value) => {
      setTimeCollector(value)
      switch (value) {
        case lastTime.LAST_DAY: 
          setRangeTime([ moment().subtract(1, 'day').format(DATE_TIME), moment().format(DATE_TIME) ]) 
          break;
        case lastTime.LAST_WEEK: 
          setRangeTime([ moment().subtract(7, 'day').format(DATE_TIME), moment().format(DATE_TIME) ]) 
          break;
        case lastTime.LAST_MONTH: 
          setRangeTime([ moment().subtract(30, 'day').format(DATE_TIME), moment().format(DATE_TIME) ]) 
          break;
        default: 
          break
      }
    }

    const listUserRanking = userRanking?.map((item, index) => {
      return (
        <li key={index}>
          <Link href={`/account?user_id=${item.user_id}`}>
            <a>
              <div className={styles.itemInfo}>
                <span className={styles.itemIndex}>#{index+1}</span>
                {item.avatar_url ? <Image src={item.avatar_url} alt='avatar_user' width={50} height={50} />  : <Image src={avatarUser} alt='avatar_user' width={50} height={50} /> }
                <span className={styles.itemName}>@{item.user_name}</span>
              </div>
              <div className={styles.itemValue}>
                <span className={styles.valueETH}>{item.total} ETH</span>
                <span className={styles.valueUSD}>${ETHPrice ? `${(Number.parseFloat(item.total * ETHPrice)).toFixed(2)}` : 'loading...'}</span>
              </div>
            </a>
          </Link>
        </li>
      )
    }) || ''

    const listCollectionRanking = collectionRanking?.map((item, index) => {
      return (
        <li key={index}>
          <Link href={`/collection/${item.id}`}>
            <a>
              <div className={styles.itemInfo}>
                <span className={styles.itemIndex}>#{index+1}</span>
                <Image src={item.logo_thumb_url} alt={item.logo_thumb_url} width={50} height={50} />
                <span className={styles.itemName}>{item.name}</span>
              </div>
              <div className={styles.itemValue}>
                <span className={styles.valueETH}>{item.total} ETH</span>
                <span className={styles.valueUSD}>${ETHPrice ? `${(Number.parseFloat(item.total * ETHPrice)).toFixed(2)}` : 'loading...'}</span>
              </div>
            </a>
          </Link>
        </li>
      )
    }) || ''

    return (
      <>
        <div className={styles.rankings}>
            <div className="container">
                <div className={styles.heading}>
                  <div className={styles.bgHeading}></div>
                    <h1>ranking rarex</h1>
                </div>
                <div className={`${styles.listTrending} row`}>
                  <div className="col-12 col-md-6 pe-md-5">
                    <div className={styles.titleTrending}>
                      <h4>Trending Creators</h4>
                      <div className={styles.filterTime}>
                        <div className={timeUser === lastTime.LAST_DAY && styles.activeDate} onClick={()=>handleChangeTimeCreator(lastTime.LAST_DAY)}>24hours</div>
                        <div className={timeUser === lastTime.LAST_WEEK && styles.activeDate} onClick={()=>handleChangeTimeCreator(lastTime.LAST_WEEK)}>7days</div>
                        <div className={timeUser === lastTime.LAST_MONTH && styles.activeDate} onClick={()=>handleChangeTimeCreator(lastTime.LAST_MONTH)}>30days</div>
                      </div>  
                    </div>
                    <ul>
                      {listUserRanking}
                    </ul>
                  </div>
                  <div className="col-12 col-md-6 ps-md-5">
                    <div className={styles.titleTrending}>
                      <h4>Trending Collectors</h4>
                      <div className={styles.filterTime}>
                         <div className={timeCollector === lastTime.LAST_DAY && styles.activeDate} onClick={()=>handleChangeTimeCollector(lastTime.LAST_DAY)}>24hours</div>
                         <div  className={timeCollector === lastTime.LAST_WEEK && styles.activeDate}  onClick={()=>handleChangeTimeCollector(lastTime.LAST_WEEK)}>7days</div>
                        <div  className={timeCollector === lastTime.LAST_MONTH && styles.activeDate}  onClick={()=>handleChangeTimeCollector(lastTime.LAST_MONTH)}>30days</div>
                      </div>
                    </div>
                    <ul>
                      {listCollectionRanking}
                    </ul>
                  </div>
                </div>
               
            </div>
        </div>
        <Footer />
        </>
    );
}

export default Rankings;


