import React from 'react';
import styles from './style.module.scss';
import Link from 'next/link'
import Image from 'next/image'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { Card } from 'antd';
import thumbAudio3 from '@/public/thumbAudio3.jpg' 
import videoPlayer from '@/public/videoPlayer.png' 
import imagePlayer from '@/public/imagePlayer.png' 
import audioPlayer from '@/public/audioPlayer.png' 

const ItemSell = ({item}) => {
    
    const typeItem = {
        IMAGE: 0,
        AUDIO: 1,
        VIDEO: 2,
        GIF: 3
    }

    return (
        <div className={styles.sellItemContainer}>
            <Link href={`/assets/${item.owner}/${item.item_id || item.id}`} >
                    <a className={styles.sellItem}>
                        <Card
                            hoverable
                        >
                            <div className={styles.itemImg}>
                                <Image objectFit='cover' alt='image_thumb_url'
                                        src={item.type === typeItem.GIF ? item.image_url : (item.image_thumb_url || thumbAudio3)}
                                        layout='fill'
                                        placeholder="blur"
                                        blurDataURL='data:image/jpeg;base64,/9j/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAFAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAdEAACAQQDAAAAAAAAAAAAAAAAAQQCAwUSBjGR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAWEQEBAQAAAAAAAAAAAAAAAAABABL/2gAMAwEAAhEDEQA/AJiFyamPaW+Mj3KEutmn6ABVaXJf/9k='
                                />
                            </div>
                            <div className={styles.sellItemContent}>
                                <div>
                                    <div className={styles.itemCollection}>
                                         <div className={styles.ownerName}>{item.name}</div>
                                        <span>#{item.collection_name} </span>
                                    </div>
                                    <div className={styles.itemDetail}>
                                        <div className={styles.itemPrice}>
                                            <span>Price</span>
                                            <div>{item.price} {item.symbol}</div>
                                        </div>
                                        <div className={styles.itemFavorite}>
                                            <div>{item.number_favorites}</div>
                                            <FavoriteBorderIcon /> 
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.typePlayer}>
                                    <Image  src={item.type == typeItem.AUDIO ? audioPlayer : (item.type === typeItem.VIDEO ? videoPlayer : imagePlayer)  } alt='type'/>
                                </div>
                            </div>
                        </Card>
                    </a>
                </Link>
        </div>
    );
}
export default ItemSell;
