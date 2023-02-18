import React from 'react';
import styles from './styles.module.scss';
import Header from '../Header';
import Meta from '../Meta';
const Layout = ({children}) => {
    return (
        <div className={styles.layout}>
            <Meta />
            <Header/>
            {children}
        </div>
    );
}

export default Layout;
