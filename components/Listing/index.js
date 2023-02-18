import React from 'react';
import { Table, Button} from 'antd'
import Link from 'next/link'
import Image from 'next/image'
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import styles from './style.module.scss'
import ether from '@/public/ether.png'

const Listing = () => {

    const columns = [
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
          render: text => {
              return {
                    props: {
                      style: {
                        fontWeight: "600",
                        fontSize: "1.6rem",
                        color: 'rgb(4, 17, 29)'}
                    },
                    children: <div className={styles.imgPrice}><Image src={ether} alt='ether'></Image>{text} <span>ETH</span></div> ,
              };
            }
        },
        {
          title: 'USD Price',
          dataIndex: 'USD',
          key: 'USD',
          render: text => {
              return {
                    props: {
                        className: "textRanking"
                    },
                    children: `$${text}`,
              };
            }
        },
        {
          title: '',
          dataIndex: '',
          key: 'buy',
          render: text => {<Button className={styles.buyListing}>Buy <ChevronRightIcon /></Button>}
        },
        {
            title: 'Expiration',
            dataIndex: 'expiration',
            key: 'expiration',
            render: text => {
              return {
                    props: {
                      style: {
                        fontWeight: "400",
                        fontSize: "14px",
                    },
                    children: '--',
                }
                }
            }
        },
        {
            title: 'From',
            dataIndex: 'from',
            key: 'from',
            render: text => {
              return {
                    props: {
                        className: "textRanking"
                    },
                    children: <Link href='/'><a>{text}</a></Link>,
              };
            }
        },
      ];

      const data = [
        // {
        //     price: '0.2',
        //     USD: '462.81',
        //     expiration: '---',
        //     from: 'Tagline',
        // },
        // {
        //     price: '0.2',
        //     USD: '462.81',
        //     expiration: '---',
        //     from: 'Tagline',
        // },
    ];

    return (
        <Table className={styles.tableListing} columns={columns} dataSource={data} pagination={false}></Table>
    );
}

export default Listing;
