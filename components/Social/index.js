import React from 'react';
import Link from 'next/link'
import { Tooltip } from 'antd'
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import WebIcon from '@material-ui/icons/Web';
import styles from './style.module.scss';

const Social = () => {
    return (
        <div className={styles.social}>
            <Link href='/'><a>
                <Tooltip title='Activity'>
                    <span><PlaylistPlayIcon /></span>
                </Tooltip>
            </a></Link>
            <Link href='/'><a>
                <Tooltip title='Website'>
                    <span><WebIcon /></span>
                </Tooltip>
            </a></Link>
            <Link href='/'><a>
                <Tooltip title='Discord'>
                    <span><i className="fab fa-discord"></i></span>
                </Tooltip>
            </a></Link>
            <Link href='/'>
                <a>
                    <Tooltip title='Activity'>
                        <span><PlaylistPlayIcon /></span>
                    </Tooltip>
                </a>
            </Link>
        </div> 
    );
}

export default Social;
