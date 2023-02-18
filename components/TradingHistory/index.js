import React from 'react';
import {Table, Checkbox, Dropdown} from 'antd'
import Link from 'next/link'
import Image from 'next/image'
import styles from './style.module.scss'
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ether from '@/public/ether.png'
import LaunchIcon from '@material-ui/icons/Launch';
import { DownOutlined } from '@ant-design/icons';
const TradingHistory = () => {
    const columns = [
        {
          title: 'Event',
          dataIndex: 'event',
          key: 'event',
          render: text => {
              return {
                    children: <div className={styles.eventHistory}><LocalOfferIcon />{text} <span>ETH</span></div> ,
              };
            }
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
          render: text => {
              return {
                    children: <div className={styles.tablePrice}><Image width={16} height={16} src={ether} alt='ether'></Image>{text} <span>4</span></div>,
              };
            }
        },
        {
          title: 'From',
          dataIndex: 'from',
          key: 'from',
          render: text => {
              return {
                    props: {
                      style: {
                        fontWeight: "400",
                        fontSize: "14px",
                        marginLeft: "8px",
                        position: "relative",
                        color: 'rgb(235, 87, 87)'
                    }
                    },
                    children: <Link href='/' ><a className={styles.wrapperFrom}><Image width={24} height={24} src='https://lh3.googleusercontent.com/QQHaL2b4P4q9XOLtxP0WeLG2mydwnz75tQkfFd-d3Xi4lT7S5_-fEY5pFtDclWAThI0Xms4ONvEAdtxrxkFeho0lT-IipPU8v9j3Zt4=s44' alt='ether'></Image>{text} <span>MadMax</span></a></Link>,
              };
            }
        },
        {
          title: 'To',
          dataIndex: 'to',
          key: 'to',
          render: text => {
              return {
                    props: {
                      style: {
                        fontWeight: "400",
                        fontSize: "14px",
                    }
                    },
                    children: <Link href='/' ><a className={styles.wrapperFrom}><Image width={24} height={24} src='https://lh3.googleusercontent.com/QQHaL2b4P4q9XOLtxP0WeLG2mydwnz75tQkfFd-d3Xi4lT7S5_-fEY5pFtDclWAThI0Xms4ONvEAdtxrxkFeho0lT-IipPU8v9j3Zt4=s44' alt='ether'></Image>{text} <span>MadMax</span></a></Link>,
              };
            }
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: text => {
              return {
                    props: {
                      style: {
                        fontWeight: "400",
                        fontSize: "14px",
                        color: "inherit"
                    },
                    children: <Link>{text}<span><LaunchIcon /></span></Link>,
                }
                }
            }
        },
      ];

      const data = [
      //   {
      //       event: 'Sale',
      //       price: '4',
      //       from: 'Madmax',
      //       to: 'OldisGold',
      //       date: '10 months ago'
      //   },
      //   {
      //     event: 'Sale',
      //     price: '4',
      //     from: 'Madmax',
      //     to: 'OldisGold',
      //     date: '10 months ago'
      //   },
      //   {
      //     event: 'Sale',
      //     price: '4',
      //     from: 'Madmax',
      //     to: 'OldisGold',
      //     date: '10 months ago'
      //   },
      //   {
      //       event: 'Sale',
      //       price: '4',
      //       from: 'Madmax',
      //       to: 'OldisGold',
      //       date: '10 months ago'
      //   },
      //   {
      //     event: 'Sale',
      //     price: '4',
      //     from: 'Madmax',
      //     to: 'OldisGold',
      //     date: '10 months ago'
      //   },
      //   {
      //     event: 'Sale',
      //     price: '4',
      //     from: 'Madmax',
      //     to: 'OldisGold',
      //     date: '10 months ago'
      //   },
      //   {
      //     event: 'Sale',
      //     price: '4',
      //     from: 'Madmax',
      //     to: 'OldisGold',
      //     date: '10 months ago'
      // },
    ];

    const handleChange = () => {}

    const filterDropdown = (
      <div>
          <Checkbox value="A">Listings</Checkbox>
          <Checkbox value="B">Sale</Checkbox>
          <Checkbox value="C">Bids</Checkbox>
          <Checkbox value="D">Transfers</Checkbox>
      </div>
    );
    return (
        <div className={styles.tradingHistory}>
          <Dropdown overlayClassName={styles.dropdownCustom} overlay={filterDropdown} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              Filter  <DownOutlined />
            </a>
          </Dropdown>
          <Table columns={columns} dataSource={data} pagination={false}></Table>
    </div>
    );
}

export default TradingHistory;
