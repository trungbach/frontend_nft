import React from 'react';
import {Skeleton} from 'antd'
import styles from './style.module.scss'

const LoadingItem = () => {
    return (
        <div className={styles.loading}>
             <Skeleton avatar={{shape: 'square'}} active />
        </div>
    );
}

export default LoadingItem;
