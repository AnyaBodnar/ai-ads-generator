import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, useVideoConfig, useCurrentFrame, spring, interpolate } from 'remotion';

export function AnimatedImage({ src, direction }) {
    const frame = useCurrentFrame();

    // Animation progress
    const progress = spring({
        frame,
        fps: 30,
        config: {
            damping: 100,
            stiffness: 200,
        },
    });

    // Different animations based on direction
    const translateX = direction === 'left'
        ? interpolate(progress, [0, 1], [500, 0]) // Slide from right to center
        : direction === 'right'
            ? interpolate(progress, [0, 1], [-500, 0]) // Slide from left to center
            : 0;

    // Zoom in and out effect dynamically
    const scale = interpolate(
        progress,
        [0, 0.5, 1],
        [1, 1.1, 1] // Zoom in a bit at middle (1.1) and back to normal
    );

    return (
        <img
            src={src}
            alt="Slide"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `translateX(${translateX}px) scale(${scale})`,
                transition: 'transform 0.5s',
            }}
        />
    );
}

function PreviewAd1({ videoInfo }) {
    console.log('VIDEOINFO', videoInfo);

    const { durationInFrames } = useVideoConfig();
    const eachImageDuration = Math.floor(durationInFrames / (videoInfo?.assets?.length || 1));

    const directions = ['left', 'right', 'zoom', 'left']; // define directions per image

    return (
        <AbsoluteFill style={{ backgroundColor: 'white' }}>
            <div
                style={{
                    height: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                {/* Images slide show */}
                {videoInfo?.assets?.map((image, index) => (
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
                ))}
            </div>

            <div
                style={{
                    height: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                {videoInfo && <OffthreadVideo
                    src={videoInfo?.avatarUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scale(3)',
                        transformOrigin: 'center center',
                    }}
                />}
            </div>
        </AbsoluteFill>
    );
}

export default PreviewAd1;
