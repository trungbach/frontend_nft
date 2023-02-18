import React,{useState, useEffect, useRef} from 'react';
import styles from './style.module.scss';
import SideFilter from '@/components/SideFilter';
import SideFilterMobile from '@/components/SideFilterMobile';
import {Select, Button} from 'antd'
import ItemSell from '@/components/ItemSell'
import {useAsset} from '@/lib/useAsset';
import {useFilterCollection} from '@/lib/useCollection';
import {getListCategory} from '../api/category';
import {getListCollection} from '../api/collection';
import {useRouter} from 'next/router';
import { checkPropertiesFilterObj, unsetRoute } from '@/utils/index'
import CloseIcon from '@material-ui/icons/Close';
import dynamic from 'next/dynamic'
import {useWindowSize} from '@/lib/useWindowSize'
import {PAGE_SIZE} from '@/config/constants'
const ListLoading = dynamic(() => import('@/components/ListLoading'))
const {Option} = Select

export async function getServerSideProps() {
    
    const listCategory = await getListCategory();
    const listCollection = await getListCollection();

    return {
        props: {
            listCategory,
            listCollection
        }
    }
}

const Assets = ({listCategory, listCollection}) => {
    const router = useRouter()
    const [filterObj, setFilterObj] = useState({ key: '', min_price: '', max_price: '', collection: '', category: '', symbol: '', type: '', pageIndex: 0})
    const [collectionName, setCollectionName] = useState('')
    const [isShowSideBar, setIsShowSideBar] = useState(false);
    const [isResetPrice, setIsResetPrice] = useState(false)
    const [listAsset, setListAsset] = useState([])
    const [sort, setSort] = useState(5)
    const [isLastPage, setIsLastPage] = useState(false)
    const moreRef = useRef()
    const { data, total_items } = useAsset(`symbol=${filterObj.symbol}&category_id=${filterObj.category?.id || ''}&collection_id=${filterObj.collection?.id || ''}&min_price=${filterObj.min_price}&max_price=${filterObj.max_price}&key=${filterObj.key}&sort=${sort}&type=${filterObj.type}&page=${filterObj.pageIndex}`)
    const {width} = useWindowSize();

    useEffect(() => {
        if(data && data.length < PAGE_SIZE) {
             setIsLastPage(true)
        } else  setIsLastPage(false)

        data !== undefined && (filterObj.pageIndex > 0 ? setListAsset([...listAsset, ...data]) : setListAsset([...data]))
    }, [data])

    const {filterCollection} = useFilterCollection(`key=${collectionName}`, listCollection)

    const [collapsed, setCollapsed] = useState(false)
    const [widthAsset, setWidthAsset] = useState();

    const loadMore = () => {
        setFilterObj({ ...filterObj, pageIndex: filterObj.pageIndex + 1 })
    } 

    const trackScrolling = (e) => {
        const bottom = Math.abs(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight) <= 1;
        if (bottom && !isLastPage && data !== undefined ) { 
            loadMore()
         } 
    };

    useEffect(() => {
      if(router.query.key === undefined) {
        setFilterObj({...filterObj, key: '', pageIndex: 0})
      }  else setFilterObj({...filterObj, key: router.query.key , pageIndex: 0})
    },[router.query.key])

    useEffect(() => {
        if(router.query.type) {
          setFilterObj({...filterObj, type: router.query.type, pageIndex: 0})
        }
      },[router.query.type])

    useEffect(() => {
        if(router.query.category_id) {
          const propCategory = listCategory.find(item => item.id == router.query.category_id)
          setFilterObj({...filterObj, category: {...propCategory}, pageIndex: 0 })
        } 
    },[router.query.category_id])

    useEffect(() => {
        let filterWidth = 0;
        if(width > 768) {
            filterWidth = collapsed ? 60 : 300
        }
        
        setWidthAsset(width - filterWidth)
    },[collapsed, width])

    const setPrice = (minPrice, maxPrice) => {
        setFilterObj({...filterObj, min_price: minPrice, max_price: maxPrice, pageIndex: 0})
    }

    const setCategory = (item) => {
        if(item == -1) {
            setFilterObj({ ...filterObj, category: '', pageIndex: 0 })
        } else {
            if(item.id == filterObj.collection?.category_id) {
                setFilterObj({ ...filterObj, category: {...item}, pageIndex: 0 })
            } else setFilterObj({ ...filterObj, category: {...item}, collection: '', pageIndex: 0 })
        }
    }

    const setCollection= (item) => {
        if(item == -1) {
            setFilterObj({ ...filterObj, collection: '', pageIndex: 0 })
        } else {
            if(item.category_id == filterObj.category?.id) {
                setFilterObj({ ...filterObj, collection: item, pageIndex: 0})
            } else setFilterObj({ ...filterObj, collection: item, category: '', pageIndex: 0})
           
        }
    }

    const setSymbol = (value) => {
        setFilterObj({ ...filterObj, symbol: value, pageIndex: 0})
    }

    const handleChangeSortBy = (obj) => {
        setSort(obj.value)
    }

    const handleChangeFilterByType = (obj) => {
        setFilterObj({ ...filterObj, type: obj.value == filterBy.All ? '' : obj.value, pageIndex: 0})
    }

    const removeFilter = () => {
        setFilterObj({ key: '', min_price: '', max_price: '', collection: '', category: '', sort: '', symbol: '', type: '', pageIndex: 0 })
        router.push('/assets', undefined, {shallow: true})
        setIsResetPrice(true)
    }

    const unsetFromRoute = (filterName) => {
        setFilterObj({ ...filterObj, [filterName]: '', pageIndex: 0 })  
        unsetRoute(filterName, filterObj, router )
    }

    const sortBy = {
        CREATED_SORT: 5,
        PRICE_INCREASE_SORT: 2,
        PRICE_REDUCED_SORT: 3,
        FAVORITE_SORT: 4,
        OLDEST_SORT :  1
    }

    const filterBy = {
        Image: 0,
        Audio: 1,
        Video: 2,
        Gif: 3,
        All: 4
    }

    const listItemResponse = listAsset?.map((item, index) => {
        return (
            <ItemSell item={item} key={index} />
        )
    }) 

    console.log(widthAsset)

    return (
        
        <div className={styles.assets}> 
            <SideFilter collectionName={collectionName} setCollectionName={setCollectionName} 
                        minPrice={filterObj.min_price} maxPrice={filterObj.max_price} setIsResetPrice={setIsResetPrice}
                        setCollection={setCollection} setCategory={setCategory} isResetPrice={isResetPrice}
                        setPrice={setPrice} listCategory={listCategory} listCollection={filterCollection} 
                        currentCollection={filterObj.collection} currentCategory={filterObj.category} 
                        collapsed={collapsed} setCollapsed={setCollapsed}
                        setSymbol={setSymbol} symbol={filterObj.symbol}
                        />
                        
            <SideFilterMobile isShowSideBar={isShowSideBar} setIsShowSideBar={setIsShowSideBar} 
                            collectionName={collectionName} setCollectionName={setCollectionName} 
                            minPrice={filterObj.min_price} maxPrice={filterObj.max_price} setIsResetPrice={setIsResetPrice}
                            setCollection={setCollection} setCategory={setCategory} isResetPrice={isResetPrice}
                            setPrice={setPrice} listCategory={listCategory} listCollection={filterCollection} 
                            currentCollection={filterObj.collection} currentCategory={filterObj.category} 
                            setSymbol={setSymbol} symbol={filterObj.symbol}/>
            <div className={`${styles.showFilter} d-flex d-lg-none`}>
                <Button className={styles.buttonShowFilter} onClick={() =>setIsShowSideBar(!isShowSideBar)}>Filter</Button>
            </div>
            <div className={styles.mainAsset} onScroll={trackScrolling} ref={moreRef}>
                <div className={styles.heading}>
                    <div className={styles.totalResult}>
                        {total_items !== undefined ?  (total_items > 0 ? `${total_items} results` : '0 result') : 'Loading...'}
                    </div>
                    <div className={styles.filter}>
                        <Select
                            labelInValue
                            value={{ value: filterObj.type !== '' ? Object.keys(filterBy)[filterObj.type] : filterBy.All}}
                            onChange={handleChangeFilterByType}
                            >
                            <Option value={filterBy.All}>All</Option>
                            <Option value={filterBy.Image}>Image</Option>
                            <Option value={filterBy.Audio}>Audio</Option>
                            <Option value={filterBy.Video}>Video</Option>
                            <Option value={filterBy.Gif}>Gif</Option>
                        </Select>
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
                </div>
                <ul className={styles.listAttributeFilter}>
                    {filterObj.key !== '' && <li className={styles.attributeFilter}>{filterObj.key} <span onClick={()=>unsetFromRoute('key')}><CloseIcon /></span></li>}
                    {filterObj.type !== '' && filterObj.type !== 4  && <li className={styles.attributeFilter}>{Object.keys(filterBy)[filterObj.type]} <span onClick={()=>unsetFromRoute('type')}><CloseIcon /></span></li>}

                    {filterObj.symbol !== '' && <li className={styles.attributeFilter}>{filterObj.symbol} <span onClick={()=>setFilterObj({ ...filterObj, symbol: '', pageIndex: 0 })}><CloseIcon /></span></li>}

                    {filterObj.category !== '' && <li className={styles.attributeFilter}>{filterObj.category.name} <span onClick={()=>unsetFromRoute('category')}><CloseIcon /></span></li>}

                    {filterObj.collection !== '' && <li className={styles.attributeFilter}>{filterObj.collection.name} <span onClick={()=>setFilterObj({ ...filterObj, collection: '', pageIndex: 0 })}><CloseIcon /></span></li>}

                    {filterObj.min_price !== '' && <li className={styles.attributeFilter}>Min: {filterObj.min_price} <span onClick={()=>setFilterObj({ ...filterObj, min_price: '', pageIndex: 0 })}><CloseIcon /></span></li>}

                    {filterObj.max_price !== '' && <li className={styles.attributeFilter}>Max: {filterObj.max_price} <span onClick={()=>setFilterObj({ ...filterObj, max_price: '', pageIndex: 0 })}><CloseIcon /></span></li>}

                    {!checkPropertiesFilterObj(filterObj) && <li className={styles.removeFilter} onClick={removeFilter}>Clear All</li>}
                </ul>

                <div  className={widthAsset < 500  ? `${styles.assetsList} ${styles.gridOne}` : widthAsset < 769 ? `${styles.assetsList} ${styles.gridTwo}` : widthAsset < 985 ? `${styles.assetsList} ${styles.gridThree}` : 
                                (widthAsset < 1250 ? `${styles.assetsList} ${styles.gridFour}` : 
                                (widthAsset < 1600 ? `${styles.assetsList} ${styles.gridFive}` :  `${styles.assetsList} ${styles.gridSix}`))
                                }
                >
                    {listItemResponse}
                    {data == undefined && <ListLoading />}
                    {data && listAsset?.length == 0 &&
                    (
                        <div className={styles.emptyResponse}>
                            <h1>Not items found for this search</h1>
                            <Button className={styles.secondaryButton} onClick={removeFilter}>Back to all items</Button>
                        </div>
                    )
                    }
                </div>
            </div>
        </div>
    );
}
export default Assets;


