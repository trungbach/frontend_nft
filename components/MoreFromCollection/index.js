import React from 'react';
import styles from './style.module.scss'
import ItemSell from '@/components/ItemSell'

const MoreFromCollection = ({moreFromCollection}) => {

    const listFromCollection = moreFromCollection?.map((item, index) => {
        return (
            <ItemSell key={index} item={item} />
        )
    }) || []
    
    return (
        <div className={styles.moreFromCollection}>
            {listFromCollection}
        </div>
    );
}

export default MoreFromCollection;
