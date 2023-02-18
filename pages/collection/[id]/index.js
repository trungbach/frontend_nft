import React, {useEffect, useState, useRef} from 'react';
import styles from './style.module.scss';
import Image from 'next/image'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import FilterListIcon from '@material-ui/icons/FilterList';
import {Input, Select, Button } from 'antd';
import {SearchOutlined  } from '@ant-design/icons'
import etherSvg from '@/public/etherSvg.svg';
import {getListCollection, getCollectionBySlug} from '@/pages/api/collection'
import {useRouter} from 'next/router'
import ListLoading from '@/components/ListLoading';
import dynamic from 'next/dynamic'
import {useAsset} from '@/lib/useAsset';
import {PAGE_SIZE} from '@/config/constants'
import CloseIcon from '@material-ui/icons/Close';

const Footer = dynamic(() => import('@/components/Footer'))
const NavBar = dynamic(() => import('@/components/SideBar'))
const ItemSell = dynamic(() => import('@/components/ItemSell'))
const {Option} = Select;

const CollectionName = ({collection}) => {
    const [filterObj, setFilterObj] = useState({ key: '', min_price: '', max_price: '', symbol: '', pageIndex: 0 })
    const [sort, setSort] = useState(5)
    const [isSeeMore, setIsSeeMore] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [heightDesc, setHeightDesc] = useState(-1);
    const [isShowSideBar, setIsShowSideBar] = useState(false);
    const [listAsset, setListAsset] = useState([])
    const [isLastPage, setIsLastPage] = useState(false)
    const refDesc = useRef();
    const router = useRouter()
    const {data} = useAsset(`collection_id=${collection.id}&min_price=${filterObj.min_price}&max_price=${filterObj.max_price}&key=${filterObj.key}&sort=${sort}&symbol=${filterObj.symbol}&page=${filterObj.pageIndex}`)

    useEffect(() => {
        if(data && data?.length < PAGE_SIZE) {
             setIsLastPage(true)
        } else  setIsLastPage(false)
        data !== undefined && (filterObj.pageIndex > 0 ? setListAsset([...listAsset, ...data]) : setListAsset(data))
    }, [data])

    const loadMore = () => {
        setFilterObj({ ...filterObj, pageIndex: filterObj.pageIndex + 1 })
    } 

    const trackScrolling = (e) => {
        const bottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight
        if (bottom && !isLastPage && data !== undefined) {
            loadMore()
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', trackScrolling);
        return () => window.removeEventListener('scroll', trackScrolling);
    });

    useEffect(() => {
        const height = refDesc.current.clientHeight
        setHeightDesc(height)
        if(height < 80) { 
            refDesc.current.style.height = 'auto';
        } else refDesc.current.style.height = '8rem';
    },[])

    const seeMore = () => {
        refDesc.current.style.height = 'auto';
        setIsSeeMore(true);
    }

    const seeLess = () => {
        refDesc.current.style.height = '8rem';
        setIsSeeMore(false)
    }

    const setPrice = (minPrice, maxPrice) => {
        setFilterObj({...filterObj, min_price: minPrice, max_price: maxPrice})
    }


    const listItem = Array.isArray(listAsset) && listAsset?.map((item, index) => {
        return (
            <div key={index} className="col-12 col-md-4 col-lg-3 mb-4">
                <ItemSell item={item} />
            </div>
        )
    }) 
  
  const onKeyDown = e => {
    if(e.key === "Enter") {
        e.preventDefault()
        setFilterObj({...filterObj, key: searchText})
    }
    }

    if (router.isFallback) {
        return <div>Loading...</div>
      }

    const handleChangeSortBy = (obj) => {
        setSort(obj.value)
    }

    const setSymbol = (value) => {
        setFilterObj({ ...filterObj, symbol: value})
    }
    
    const sortBy = {
        CREATED_SORT: 5,
        PRICE_INCREASE_SORT: 2,
        PRICE_REDUCED_SORT: 3,
        FAVORITE_SORT: 4,
        OLDEST_SORT :  1
    }

    return (
        <>
        <div className={styles.collection}>
            <div className={styles.banner}>
                {collection.cover_url ? <Image layout='fill' objectFit='cover' src={collection.cover_url} alt="cover-collection" /> : null}
            </div>
            <div onClick={()=>setIsShowSideBar(false)} className={styles.overlay} style={{display: isShowSideBar ? 'block' : 'none'}}></div>
            <NavBar setSymbol={setSymbol} setPrice={setPrice} isShowSideBar={isShowSideBar} setIsShowSideBar={setIsShowSideBar} />
            <div className={styles.content}>
                <div className="container">
                <div className={styles.heading}>
                    <div className={styles.avatar}>
                        {collection.logo_url ? <Image layout='fill' style={{objectFit: 'cover'}} src={collection.logo_url} alt={collection.logo_url} /> : null}
                    </div>
                    <h1>{collection.name}</h1>
                    <div className={styles.about}>
                    <div className={styles.aboutContainer}>
                        <div>
                            <h3>
                                {collection.total_item}
                            </h3>
                            <span>items</span>
                        </div>
                        <div>
                            <h3>
                                {collection.total_bought_item}
                            </h3>
                            <span>owners</span>
                        </div>
                        <div>
                            <h3>
                                <Image width={20} height={20} src={etherSvg} alt='Ether' />  {collection.min_price}
                            </h3>
                            <span>min price</span>
                        </div>
                        <div>
                            <h3>
                                <Image width={20} height={20} src={etherSvg} alt='Ether' />  {collection.max_price}
                            </h3>
                            <span>max price</span>
                        </div>
                    </div>
                    </div>
                    
                    <p ref={refDesc}>
                        {collection.description}
                    </p>
                    {heightDesc > 80 && 
                        (!isSeeMore ? <div  type='button' className={styles.seeMoreBtn} onClick={seeMore}><ExpandMoreIcon /></div>
                        : <div type='button' className={styles.seeMoreBtn} onClick={seeLess}> <ExpandLessIcon /></div>)}
                </div>
                <div className={styles.filter}>
                    <div>
                        <Input prefix={<SearchOutlined />} placeholder="Search" onChange={e => setSearchText(e.target.value)}  onKeyPress={onKeyDown} />
                    </div>
                    <div className={styles.filterSelect}>
                        <Select
                            labelInValue
                            placeholder="Sort by"
                            onChange={handleChangeSortBy}
                            >
                            <Option value={sortBy.CREATED_SORT}>Recently Created</Option>
                            <Option value={sortBy.PRICE_INCREASE_SORT}>Price: Low to High</Option>
                            <Option value={sortBy.PRICE_REDUCED_SORT}>Price: High to Low</Option>
                            <Option value={sortBy.FAVORITE_SORT}>Most Favorite</Option>
                            <Option value={sortBy.OLDEST_SORT}>Oldest</Option>
                        </Select>
                    </div>
                    <div>
                        <Button className={styles.buttonShowFilter} onClick={()=>setIsShowSideBar(true)}><FilterListIcon />Filter</Button>
                    </div>
                </div>
                <div className='row'>
                    {listItem}
                    {data == undefined && <ListLoading />}
                </div> 
            </div>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default CollectionName;

export async function getStaticPaths() {

    const listCollection = await getListCollection();
    return {
        paths: listCollection?.map(collection => ({ params: { id: collection.id.toString() } })) || [],
        fallback: "blocking"
    }

}

export async function getStaticProps({params}) {

    const collection = await getCollectionBySlug({id: params.id});
    return {
        props: {
            collection
        },
        revalidate: 20,
    }
}

