import React from 'react';
import ItemSell from '@/components/ItemSell'
import styles from './style.module.scss';

const ItemFromProfile = ({listItem, width, type}) => {

    const listItemUI = listItem.length > 0 ? listItem.map((item, index) => {
        return (
          <div key={index} className="mb-4">
              <ItemSell item={item}/>
          </div>
        )
    }) : (<div className={styles.emptyItem}>User have  not {type} any products yet.</div>)

    return (
        <div style={{position: 'relative'}} className={width < 500 ? styles.gridOne : width < 769 ? styles.gridTwo : width < 900 ? styles.gridThree : width < 1300 ? styles.gridFour : (width < 1600 ? styles.gridFive : styles.gridSix)}>
            {listItemUI}
        </div>
    );
}

export default ItemFromProfile;
