import React from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, useVideoConfig } from 'remotion';
import { AnimatedImage } from './PreviewAd1';


function PreviewAd2({ videoInfo }) {
    const { durationInFrames, fps } = useVideoConfig();

    // Split durations based on audio length
    const firstVideoDuration = Math.floor(durationInFrames * 0.2);
    const imagesDuration = Math.floor(durationInFrames * 0.6);
    const secondVideoStart = firstVideoDuration + imagesDuration;

    const eachImageDuration = Math.floor(imagesDuration / videoInfo?.assets?.length);
    const directions = ['left', 'zoom', 'right', 'zoom', 'left']; // define directions per image

    return (
        <AbsoluteFill style={{ backgroundColor: "white" }}>
            {/* 🔥 Video: visible first 20%, hide during images, visible again */}
            {videoInfo && <OffthreadVideo
                src={videoInfo?.avatarUrl}

                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transform: 'scale(2)', // 👈 apply zoom
                    transformOrigin: 'center center', // 👈 zoom from center
                }}
            />}

            {/* 🖼️ Images covering 60% in middle */}
            <Sequence from={firstVideoDuration} durationInFrames={imagesDuration}>
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'white',
                }}>
                    <div style={{
                        height: '60%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}>
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
                    </div>
                    <div style={{
                        height: '40%',
                        backgroundColor: '#f0f0f0',
                    }} />
                </div>
            </Sequence>

            {/* 🔊 Audio throughout */}
            {/* <Audio src={audioSrc} /> */}
        </AbsoluteFill>
    );
}

export default PreviewAd2;