import React from 'react';

const VideoItem = ({src}) => {
    return (
        <video width="100%" height="100%" autoPlay controls>
            <source src={src}  type="video/mp4" />
        </video>
    );
}

export default VideoItem;
