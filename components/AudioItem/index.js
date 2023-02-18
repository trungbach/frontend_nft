import React from 'react';
import thumbAudio3 from '@/public/thumbAudio3.jpg'
import styles from './style.module.scss'
import Image from 'next/image'

const AudioItem = ({src, thumbUrl}) => {
    return (
        <>
            <Image objectFit='contain' objectPosition='center center' layout='fill' src={thumbUrl} alt='thumb-audio' />
            <audio className={styles.audio} controls autoPlay >
                <source src={src} type="audio/mpeg" />
            </audio>
        </>
    );
}

export default AudioItem;
