import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, useVideoConfig } from 'remotion';
import { AnimatedImage } from './PreviewAd1';

function PreviewAd3({ videoInfo }) {
    const { durationInFrames } = useVideoConfig();

    const avatarUrl = videoInfo?.avatarUrl;
    const hasAvatarUrl = typeof avatarUrl === 'string' && avatarUrl.length > 0;

    const assets = Array.isArray(videoInfo?.assets)
        ? videoInfo.assets.filter((item) => typeof item === 'string' && item.length > 0)
        : [];

    const eachImageDuration = assets.length > 0
        ? Math.floor(durationInFrames / assets.length)
        : durationInFrames;

    const directions = ['left', 'zoom', 'right', 'zoom', 'left'];

    return (
        <AbsoluteFill style={{ backgroundColor: "white", position: 'relative' }}>
            {/* Full screen images */}
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

            {/* Small avatar video at bottom-right */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    width: 450,
                    height: 350,
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {hasAvatarUrl ? (
                    <OffthreadVideo
                        src={avatarUrl}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            transform: 'scale(2)',
                            transformOrigin: 'center center',
                        }}
                    />
                ) : (
                    <div
                        style={{
                            fontSize: 24,
                            color: '#555',
                            textAlign: 'center',
                            padding: 20,
                        }}
                    >
                        Avatar video is still generating...
                    </div>
                )}
            </div>
        </AbsoluteFill>
    );
}

export default PreviewAd3;