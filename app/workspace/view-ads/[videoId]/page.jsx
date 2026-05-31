"use client";

import { api } from "@/convex/_generated/api";
import { Player } from "@remotion/player";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React from "react";
import PreviewAd1 from "../_components/PreviewAd1";
import { Button } from "@/components/ui/button";
import PreviewAd2 from "../_components/PreviewAd2";
import PreviewAd3 from "../_components/PreviewAd3";

function getScriptText(script) {
    if (!script) return "";

    if (typeof script === "string") {
        return script;
    }

    if (typeof script === "object") {
        return (
            script.content ||
            script.script ||
            script.text ||
            script.description ||
            JSON.stringify(script)
        );
    }

    return String(script);
}

function estimateDurationFromScript(script) {
    const scriptText = getScriptText(script);
    const words = scriptText.split(/\s+/).filter(Boolean).length;

    // Середній темп озвучки: приблизно 2.2–2.5 слова/сек.
    const wordsPerSecond = 2.3;

    if (!words) return 16;

    return Math.max(8, Math.ceil(words / wordsPerSecond));
}

function ViewAds() {
    const { videoId } = useParams();

    const videoInfo = useQuery(api.videoData.GetVideoDataById, {
        vid: videoId,
    });

    const FPS = 30;

    if (videoInfo === undefined) {
        return (
            <div className="mt-10">
                <h2 className="font-bold text-2xl">Loading video ads...</h2>
            </div>
        );
    }

    const realAudioDuration = Number(videoInfo?.audioDuration || 0);
    const estimatedDuration = estimateDurationFromScript(videoInfo?.script);

    const durationInSeconds = Math.ceil(
        (realAudioDuration || estimatedDuration || 16) + 1
    );

    const durationInFrames = durationInSeconds * FPS;

    const playerStyle = {
        width: "20vw",
        height: "70vh",
    };

    const inputProps = {
        videoInfo: videoInfo,
    };

    return (
        <div className="mt-10">
            <h2 className="font-bold text-2xl">Select the best Video ads style</h2>
            <p>Explore and select the video style which matches your product</p>

            <div className="flex gap-10 flex-wrap">
                <div>
                    <Player
                        component={PreviewAd1}
                        durationInFrames={durationInFrames}
                        compositionWidth={720}
                        compositionHeight={1280}
                        fps={FPS}
                        controls
                        style={playerStyle}
                        inputProps={inputProps}
                    />

                    <Button className="mt-5 w-full">Render for Download</Button>
                </div>

                <div>
                    <Player
                        component={PreviewAd2}
                        durationInFrames={durationInFrames}
                        compositionWidth={720}
                        compositionHeight={1280}
                        fps={FPS}
                        controls
                        style={playerStyle}
                        inputProps={inputProps}
                    />

                    <Button className="mt-5 w-full">Render for Download</Button>
                </div>

                <div>
                    <Player
                        component={PreviewAd3}
                        durationInFrames={durationInFrames}
                        compositionWidth={720}
                        compositionHeight={1280}
                        fps={FPS}
                        controls
                        style={playerStyle}
                        inputProps={inputProps}
                    />

                    <Button className="mt-5 w-full">Render for Download</Button>
                </div>
            </div>
        </div>
    );
}

export default ViewAds;