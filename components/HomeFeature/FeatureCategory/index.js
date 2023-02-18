import React, {useEffect, useState} from 'react';
import Link from 'next/link'
import styles from './style.module.scss'
import {getListItem} from '@/pages/api/asset';
import ItemSell from '@/components/ItemSell';
import { searchCategory } from '@/store/search/action'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {useRouter} from 'next/router'
const FeatureCategory = ({category, searchCategory}) => {

    const [itemByCategory, setItemByCategory] = useState([])
    const router = useRouter()
    useEffect(() => {
        const getItemByCategory = async() => {
            const {data} = await getListItem({category_id: category.id})
            setItemByCategory(data)
        }
        getItemByCategory()
    },[category])

    const listItem = itemByCategory && itemByCategory.map((item, index) => {
        if(index < 8) {
            return (
                <div key={index} className="col-xl-3 col-12 col-md-6 col-lg-4">
                    <ItemSell item={item} />
                </div>
            )
        } else return null
    })

    const goToCategory = () => {
        searchCategory(category.id)
        router.push(`/assets?category_id=${category.id}`)
    }

    return (
        <div className={styles.featureCategory}>
            <div className="container">
                <div className={styles.headingSection}>
                    <h2 className={styles.titleHome}>
                        Featured {category.name}
                    </h2>
                    {/* <span className={styles.viewAll} onClick={goToCategory}>View all</span> */}
                    <Link href={`/category/${category.id}`}>
                        <a  className={styles.viewAll}>
                            View all
                        </a>
                    </Link>
                </div>
                <div className={`${styles.listItem} row`}>
                    {listItem}
                </div>
            </div>
            
        </div>
    );
}

const mapStateToProps = (state) => ({
    isLoggedIn: state.login.isLoggedIn,
    user: state.login.user,
    categoryId: state.search.categoryId
})
  
const mapDispatchToProps = (dispatch) => {
    return {
        searchCategory: bindActionCreators(searchCategory, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeatureCategory)
