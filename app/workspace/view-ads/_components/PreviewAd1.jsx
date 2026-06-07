import React from 'react';
import {
    AbsoluteFill,
    OffthreadVideo,
    Sequence,
    useVideoConfig,
    useCurrentFrame,
    spring,
    interpolate
} from 'remotion';

export function AnimatedImage({ src, direction }) {
    const frame = useCurrentFrame();

    const progress = spring({
        frame,
        fps: 30,
        config: {
            damping: 100,
            stiffness: 200,
        },
    });

    const translateX = direction === 'left'
        ? interpolate(progress, [0, 1], [300, 0])
        : direction === 'right'
            ? interpolate(progress, [0, 1], [-300, 0])
            : 0;

    const scale = interpolate(
        progress,
        [0, 0.5, 1],
        [0.95, 1.03, 1]
    );

    if (!src || typeof src !== 'string') {
        return null;
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
            }}
        >
            <img
                src={src}
                alt="Product"
                style={{
                    maxWidth: '88%',
                    maxHeight: '88%',
                    objectFit: 'contain',
                    transform: `translateX(${translateX}px) scale(${scale})`,
                }}
            />
        </div>
    );
}

function PreviewAd1({ videoInfo }) {
    const { durationInFrames } = useVideoConfig();

    const assets = Array.isArray(videoInfo?.assets)
        ? videoInfo.assets.filter((item) => typeof item === 'string' && item.length > 0)
        : [];

    const avatarUrl = videoInfo?.avatarUrl;
    const hasAvatarUrl = typeof avatarUrl === 'string' && avatarUrl.length > 0;

    const eachImageDuration = assets.length > 0
        ? Math.floor(durationInFrames / assets.length)
        : durationInFrames;

    const directions = ['left', 'right', 'zoom', 'left'];

    return (
        <AbsoluteFill style={{ backgroundColor: 'white' }}>
            {/* Product images block */}
            <div
                style={{
                    height: '42%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    padding: 24,
                }}
            >
                {assets.length > 0 ? (
                    assets.map((image, index) => (
                        <Sequence
                            key={index}
                            from={index * eachImageDuration}
                            durationInFrames={eachImageDuration}
                        >
                            <AnimatedImage
                                src={image}
                                direction={directions[index % directions.length]}
                            />
                        </Sequence>
                    ))
                ) : (
                    <div
                        style={{
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
 {/* Avatar block */}
            <div
                style={{
                    height: '58%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                }}
            >
                {hasAvatarUrl ? (
                    <OffthreadVideo
                        src={avatarUrl}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            transform: 'scale(1.08)',
                            transformOrigin: 'center bottom',
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
            </div>
        </AbsoluteFill>
    );
}

export default PreviewAd1;