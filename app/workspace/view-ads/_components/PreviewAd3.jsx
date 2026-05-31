import React from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, useVideoConfig } from 'remotion';
import { AnimatedImage } from './PreviewAd1';


function PreviewAd3({ videoInfo }) {
    const { durationInFrames } = useVideoConfig();
    const eachImageDuration = Math.floor(durationInFrames / videoInfo?.assets?.length);
    const directions = ['left', 'zoom', 'right', 'zoom', 'left']; // define directions per image

    return (
        <AbsoluteFill style={{ backgroundColor: "white", position: 'relative' }}>
            {/* 🖼️ Full screen images */}
            {videoInfo?.assets.map((src, index) => (
                <Sequence
                    key={index}
                    from={index * eachImageDuration}
                    durationInFrames={eachImageDuration}
                >
                    <AnimatedImage
                        src={src}
                        direction={directions[index % directions.length]}
                    />
                </Sequence>
            ))}

            {/* 🎥 Tiny video always playing at bottom-right */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    width: 450, // or any size you want
                    height: 350,
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
            >
                {videoInfo && <OffthreadVideo
                    src={videoInfo?.avatarUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scale(2)', // 👈 apply zoom
                        transformOrigin: 'center center', // 👈 zoom from center
                    }}
                />}
            </div>

            {/* 🔊 Audio throughout */}
            {/* <Audio src={audioSrc} /> */}
        </AbsoluteFill>
    );
}

export default PreviewAd3;