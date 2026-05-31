import { inngest } from "@/inngest/client";
import axios from "axios";
import { NextResponse } from "next/server";
/**
 * 
 * @param {*} req 
 * @returns 
 * 
video_id
: 
"6a7a0d68-0c79-4b50-8399-56b691232172"
video_status
: 
1
_id
: 
"680ad7c283786a047668210a"

 data: {
    _id: '680ad7c283786a047668210a',
    uid: 6045371,
    video_id: '6a7a0d68-0c79-4b50-8399-56b691232172',
    task_id: '680ad7c28adb9c352ee0dff5',
    video_status: 1,
    video: '',
    create_time: 1745541058903
  }
 */



export async function POST(req) {
    const { avatarId, voiceUrl, videoRecordId } = await req.json();

    // Get Avatar Generated ID
    // const result = await axios.post('https://openapi.akool.com/api/open/v3/talkingavatar/create', {
    //     "width": 3840,
    //     "height": 2160,
    //     "avatar_from": 2,
    //     "elements": [
    //         {
    //             "type": "image",
    //             "url": '#ffffff00',
    //             "width": 780,
    //             "height": 438,
    //             "scale_x": 1,
    //             "scale_y": 1,
    //             "offset_x": 1920,
    //             "offset_y": 1080
    //         },
    //         {
    //             "type": "avatar",
    //             "scale_x": 1,
    //             "scale_y": 1,
    //             "width": 1500,
    //             "height": 1500,
    //             "offset_x": 1920,
    //             "offset_y": 1080,
    //             avatar_id: avatarId
    //         },
    //         {
    //             "type": "audio",
    //             "url": voiceUrl
    //         }
    //     ],
    // },
    //     {
    //         headers: {
    //             Authorization: 'Bearer ' + process.env.AKOOL_API_TOKEN
    //         }
    //     })


    // const generatedAvatarId = result.data?.data?._id//'680add9783786a0476683730'//
    // const poll = async (retries = 10, interval = 5000) => {
    //     for (let i = 0; i < retries; i++) {
    //         const pollRes = await axios.get('https://openapi.akool.com/api/open/v3/content/video/infobymodelid?video_model_id=' + generatedAvatarId,
    //             {
    //                 headers: {
    //                     Authorization: 'Bearer ' + process.env.AKOOL_API_TOKEN
    //                 }
    //             }
    //         );
    //         const status = pollRes?.data?.data?.video_status
    //         if (status === 3) {
    //             return pollRes.data.data.video;// Audio is Ready
    //         }
    //         else if (status == 4) {
    //             throw new Error("Audio processing failed");
    //         }

    //         await new Promise(resolve => setTimeout(resolve, interval))

    //     }

    // }
    // const avatarVideoUrl = await poll();
    // return NextResponse.json({
    //     avatarVideoUrl: avatarVideoUrl
    // });

    await inngest.send({
        name: "create-avatar",
        data: {
            avatarId: avatarId,
            voiceUrl: voiceUrl,
            videoRecordId: videoRecordId
        },
    });

    return NextResponse.json({ message: "Event sent!" });



}