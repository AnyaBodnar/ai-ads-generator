import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, useVideoConfig } from 'remotion';
import { AnimatedImage } from './PreviewAd1';

function PreviewAd2({ videoInfo }) {
    const { durationInFrames } = useVideoConfig();

    const avatarUrl = videoInfo?.avatarUrl;
    const hasAvatarUrl = typeof avatarUrl === 'string' && avatarUrl.length > 0;

    const assets = Array.isArray(videoInfo?.assets)
        ? videoInfo.assets.filter((item) => typeof item === 'string' && item.length > 0)
        : [];

    const firstVideoDuration = Math.floor(durationInFrames * 0.2);
    const imagesDuration = Math.floor(durationInFrames * 0.6);

    const eachImageDuration = assets.length > 0
        ? Math.floor(imagesDuration / assets.length)
        : imagesDuration;

    const directions = ['left', 'zoom', 'right', 'zoom', 'left'];

    return (
        <AbsoluteFill style={{ backgroundColor: "white" }}>
            {hasAvatarUrl ? (
                <OffthreadVideo
                    src={avatarUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                        transform: 'scale(2)',
                        transformOrigin: 'center center',
                    }}
                />
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                        color: '#555',
                        textAlign: 'center',
                        padding: 40,
                        backgroundColor: '#f5f5f5',
                    }}
                >
                    Avatar video is still generating...
                </div>
            )}

            <Sequence from={firstVideoDuration} durationInFrames={imagesDuration}>
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'white',
                    }}
                >
                    <div
                        style={{
                            height: '60%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        {assets.length > 0 ? (
                            assets.map((src, index) => (
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
                            ))
                        ) : (
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 32,
                                    color: '#555',
                                    textAlign: 'center',
                                    padding: 40,
                                }}
                            >
                                 Product images are not available
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            height: '40%',
                            backgroundColor: '#f0f0f0',
                        }}
                    />
                </div>
            </Sequence>
        </AbsoluteFill>
    );
}

export default PreviewAd2;