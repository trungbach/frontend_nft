import React from 'react';
import styles from './style.module.scss'
import {Card} from 'antd';
import Link from 'next/link'
import Image from 'next/image'
import {useRouter} from 'next/router'
import { setType } from '@/store/search/action'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const Banner = ({mostFavoriteItem, setType}) => {
    const router = useRouter()
    const filterBy = {
        IMAGE: 0,
        AUDIO: 1,
        VIDEO: 2,
    }

    const goToAsset = (type) => {
        router.push(`/assets?type=${type}`, undefined)
        setType(type)
    }


    return (
        <div className={styles.banner}>
            <div className={styles.bannerBackground} style={{backgroundImage: `url(${mostFavoriteItem?.image_url})`}}></div>
            {mostFavoriteItem &&
            <div className={styles.bannerContent}>
                <div className='container h-100'>
                    <div className='row h-100'> 
                        <div className={`col-lg-5  col-12 ${styles.bannerRight}`}>
                            <div className={styles.hotItem}>
                                <Link href={`/assets/${mostFavoriteItem.owner}/${mostFavoriteItem.id}`}>
                                    <a>
                                        <Card
                                            hoverable
                                            cover={<Image loading='eager' priority='true' src={mostFavoriteItem.image_url}  width={450} height={420} alt={mostFavoriteItem.image_url}/>}
                                        >
                                            <div className={styles.favoriteContent}>
                                                <h4>{mostFavoriteItem.name}</h4>
                                                <div>{`@${mostFavoriteItem.created_user_name}`}</div>
                                            </div>
                                        </Card>
                                    </a>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-7 col-12 position-lg-relative" >
                            <h1>Create and sell your NFTs</h1>
                            <div className={styles.cta}>
                                <Link href='/assets'>
                                    <a className={styles.ctaButton}>
                                        <span>
                                            All NFTs
                                        </span>
                                    </a>
                                </Link>
                                <div className={styles.ctaButton} onClick={()=>goToAsset(filterBy.AUDIO)}>
                                    <span>
                                        AUDIO
                                    </span>
                                </div>
                                <div className={styles.ctaButton} onClick={()=>goToAsset(filterBy.VIDEO)}>
                                    <span>
                                        VIDEO
                                    </span>
                                </div>
                                <div className={styles.ctaButton} onClick={()=>goToAsset(filterBy.IMAGE)}>
                                   <span>
                                        IMAGE
                                   </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    );
}

const mapStateToProps = (state) => ({
    type: state.search.type
})
  
const mapDispatchToProps = (dispatch) => {
    return {
        setType: bindActionCreators(setType, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Banner)

