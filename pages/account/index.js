import React, {useEffect, useState} from 'react';
import Image from 'next/image'
import {getMyAsset, getMyCreated, getMyFavorited, getMyResell} from '@/pages/api/asset'
import {useRouter} from 'next/router'
import { Tabs } from 'antd';
import { connect } from 'react-redux'
import styles from './style.module.scss';
import avatar from '@/public/30.png'
import bannerCollection from '@/public/bannerCollection.png'
import { getProfileById} from '@/pages/api/user'
import dynamic from 'next/dynamic'
import {useWindowSize} from '@/lib/useWindowSize'
import ItemFromProfile from '@/components/ItemFromProfile'
const Footer = dynamic(() => import('@/components/Footer'))
const { TabPane } = Tabs;

export async function getServerSideProps({ query }) {
    const myAsset = await getMyAsset({ user_id: query.user_id })
    const myCreated = await getMyCreated({ user_id: query.user_id })
    const myFavorited = await getMyFavorited({ user_id: query.user_id })
    const myResell = await getMyResell({ user_id: query.user_id })
    const infoUser = await getProfileById({ id: query.user_id })

    return {
        props: {
            myAsset,
            myCreated,
            myFavorited,
            myResell,
            infoUser
        }
    }
}

const Account = ({myAsset, myCreated, myFavorited, isLoggedIn, infoUser, myResell}) => {
    const router = useRouter()
    const [currentTab, setCurrentTab] = useState('collected')

    const {width} = useWindowSize();

    useEffect(() => {
        setCurrentTab(router.query.tab)
    },[router.query])

    useEffect(() => {
        if(!isLoggedIn) {
           router.push('/login')
      }
    },[isLoggedIn])

    const [tabPosition, setTabPosition] = useState('left');

    useEffect(() => {
        width >= 768 ? setTabPosition('left') : setTabPosition('top')
    },[width])

    return (
        <>
        <div className={styles.collection}>
            <div className={styles.banner}>
              <Image layout='fill' objectFit='cover' src={infoUser.cover_url || bannerCollection} alt="cover" />
            </div>
            <div className={styles.content}>
                <div className="container" style={{marginBottom: '5rem'}}>
                    <div className={styles.heading}>
                        <div className={styles.avatar}>
                           <Image layout='fill' style={{objectFit: 'cover'}} 
                           priority='true'
                            src={infoUser.avatar_url || avatar} alt="avatar" />
                        </div>
                        <h1>{infoUser.username}</h1>
                        <p>{infoUser.description}</p>
                        <div className={styles.about}>
                            {infoUser.public_address}
                        </div>
                    </div>
                </div>
                <Tabs tabPosition={tabPosition} activeKey={currentTab} onChange={(activeKey)=>setCurrentTab(activeKey)}>
                    <TabPane tab="Collected" key='collected'>
                        <ItemFromProfile listItem={myAsset} width={width} type='purchased'/>
                    </TabPane>
                    <TabPane tab="Resell" key='resell'>
                        <ItemFromProfile listItem={myResell} width={width} type='resell'/>
                    </TabPane>
                    <TabPane tab="Created" key='created'>
                        <ItemFromProfile listItem={myCreated} width={width} type='created'/>
                    </TabPane>
                    <TabPane tab="Favorited" key="favorites">
                        <ItemFromProfile listItem={myFavorited} width={width} type='favorited'/>
                    </TabPane>
                </Tabs>
            </div>
        </div>
        <Footer />
        </>
    );
}

const mapStateToProps = (state) => ({
    isLoggedIn: state.login.isLoggedIn,
    user: state.login.user
})

export default connect(mapStateToProps)(Account)





