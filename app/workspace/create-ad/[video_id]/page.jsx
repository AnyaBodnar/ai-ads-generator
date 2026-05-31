"use client"
import { api } from '@/convex/_generated/api';
import { useConvex, useMutation, useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import Script from './_components/Script';
import UploadFiles from './_components/UploadFiles';
import AvatarList from './_components/AvatarList';
import VoiceList from './_components/VoiceList';
import { Button } from '@/components/ui/button';
import { LoaderCircle, Sparkles } from 'lucide-react';
import ImageKit from 'imagekit';
import axios from 'axios';
import { UserDetailContext } from '@/context/UserDetailContext';
import { toast } from 'sonner';

function CreateVideo() {
    const { video_id } = useParams();
    const [videoData, setVideoData] = useState();
    const [loading, setLoading] = useState(false);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const createVideoDataEntry = useMutation(api.videoData.updateInitialVideoData);
    const router = useRouter();
    const UpdateUserCredits = useMutation(api.users.updateUserCredits)
    // const VideoData = useQuery(api.videoData.GetVideoDataById, {
    //     vid: video_id
    // });

    const imageKit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL
    })
    const convex = useConvex();

    useEffect(() => {
        GetVideoData();
    }, [])
    const GetVideoData = async () => {
        const result = await convex.query(api.videoData.GetVideoDataById, {
            vid: video_id
        });
        console.log(result);
        setVideoData(result);
    }

    const onHandleInputChange = async (field, value) => {
        setVideoData(prev => ({
            ...prev,
            [field]: value
        }))
        console.log(videoData)


    }


    const GenerateVideo = async () => {

        if (!videoData?.assets?.length == 0 || !videoData?.script || !videoData?.avatar?._id || !videoData?.voice?._id) {

            toast('Please select all field')
            return;
        }
        console.log("HEREN")

        // Upload The Images
        setLoading(true);
        const rawFiles = videoData?.rawFiles;
        let uploadedFiles = [];
        rawFiles?.forEach(async (file) => {
            const imageRef = await imageKit.upload({
                file: file,
                fileName: Date.now().toString() + ".png",
                isPublished: true
            })
            console.log(imageRef.url);
            uploadedFiles.push(imageRef.url);
        });
        if (rawFiles) {
            const uploadPromises = rawFiles.map(async (file) =>
                await imageKit.upload({
                    file: file,
                    fileName: Date.now().toString() + ".png",
                    isPublished: true
                })
            )
            try {
                const uploadedFilesPromise = await Promise.all(uploadPromises);
                const uploadedFiles = uploadedFilesPromise.map((imageRef) => imageRef.url)
                console.log(uploadedFiles);
                onHandleInputChange('assets', uploadedFiles);
            } catch (e) {
                console.log("Error", e)
            }
        }
        // generate Voice + Generate Avatar

        const voiceResult = await axios.post('/api/create-voice', {
            script: videoData?.script,
            voiceId: videoData?.voice?.voice_id
        });
        
        console.log("Create voice result:", voiceResult.data);
        
        const audioUrl = voiceResult.data?.audioUrl;
        
        if (!audioUrl) {
            console.error("Audio URL not found:", voiceResult.data);
            throw new Error("Audio URL not found from /api/create-voice");
        }
        
        onHandleInputChange('voiceUrl', audioUrl);
        
        
        console.log("Create avatar payload:", {
            voiceUrl: audioUrl,
            avatarId: videoData?.avatar?.avatar_id,
            videoRecordId: video_id
        });
        
        const AvatarResult = await axios.post('/api/create-avatar', {
            voiceUrl: audioUrl,
            avatarId: videoData?.avatar?.avatar_id,
            videoRecordId: video_id
        });

        console.log(AvatarResult.data);
        // onHandleInputChange('avatarUrl', AvatarResult.data?.avatarVideoUrl)


        // Update Credits
        setUserDetail(prev => ({
            ...prev,
            credits: Number(userDetail?.credits) - 10
        }))

        // Update Credits to DB
        const resp = await UpdateUserCredits({
            credits: Number(userDetail?.credits) - 10,
            uid: userDetail?._id
        });
        console.log(resp);


        setLoading(false);
        router.replace('/workspace')
    }

    useEffect(() => {
        async function saveDB() {
            if (videoData?.voiceUrl) {
                const result = await createVideoDataEntry({
                    topic: videoData?.topic,
                    scriptVariant: videoData?.scriptVariant,
                    videoDataRecordId: video_id,
                    assets: videoData?.assets,
                    avatar: videoData?.avatar,
                    script: videoData?.script,
                    voice: videoData?.voice,
                    voiceUrl: videoData?.voiceUrl
                });
                console.log(result);


            }
        }
        saveDB();
    }, [videoData?.voiceUrl])

    return (
        <div>
            <h2 className='font-bold text-2xl'>Create Video Ad</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 mt-8'>
                <div className='md:col-span-2'>
                    <Script videoData={videoData} onHandleInputChange={onHandleInputChange} />
                    <UploadFiles videoData={videoData} onHandleInputChange={onHandleInputChange} />
                    <AvatarList videoData={videoData} onHandleInputChange={onHandleInputChange} />
                    <VoiceList videoData={videoData} onHandleInputChange={onHandleInputChange} />
                    <Button className={'mt-5 w-full'}
                        onClick={GenerateVideo} disabled={loading}>
                        {loading ? <LoaderCircle className='animate-spin' /> : <Sparkles />}
                        Generate </Button>
                </div>
                
            </div>
        </div>
    )
}

export default CreateVideo