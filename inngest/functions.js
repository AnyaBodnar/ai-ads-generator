import axios from "axios";
import { inngest } from "./client";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";



export const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
    triggers: { event: "test/hello.world" },
  },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");

    return {
      message: `Hello ${event.data.email}!`,
    };
  },
);

//680c130f3cd1e391551f2cbb
export const CreateAvatar = inngest.createFunction(
  {
    id: "create-avatar",
    triggers: { event: "create-avatar" },
  },
  async ({ event, step }) => {
    const { avatarId, voiceUrl, videoRecordId } = event.data;
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)
    const CreateAvatarId = await step.run(
      "GenerateAvatarId",
      async () => {
        console.log("CreateAvatar input:", {
          avatarId,
          voiceUrl,
          videoRecordId,
        });
        if (!avatarId) {
          throw new Error("avatarId is missing");
        }
        
        if (!voiceUrl || !voiceUrl.startsWith("http")) {
          throw new Error("voiceUrl is missing or invalid: " + voiceUrl);
        }
        
        if (!videoRecordId) {
          throw new Error("videoRecordId is missing");
        }

        const payload = {
          width: 3840,
          height: 2160,
          avatar_from: 2,
          elements: [
            {
              type: "image",
              url: "#ffffff",
              width: 3840,
              height: 2160,
              scale_x: 1,
              scale_y: 1,
              offset_x: 1920,
              offset_y: 1080,
            },
            {
              type: "avatar",
              scale_x: 1,
              scale_y: 1,
              width: 900,
              height: 1600,
              offset_x: 1920,
              offset_y: 1080,
              avatar_id: avatarId,
            },
            {
              type: "audio",
              url: voiceUrl,
            },
          ],
        };
        
        console.log("Akool talking avatar payload:", JSON.stringify(payload, null, 2));

        const result = await axios.post(
          "https://openapi.akool.com/api/open/v3/talkingavatar/create",
          payload, 
          {
            headers: {
              "x-api-key": process.env.AKOOL_API_TOKEN,
              "Content-Type": "application/json",
            },
          }
        );
    
        const generatedAvatarId = result.data?.data?._id;
    
        if (!generatedAvatarId) {
          throw new Error(
            "Akool did not return generated avatar id: " + JSON.stringify(result.data)
          );
        }
    
        return generatedAvatarId;
      }
    );

    const GenerateAvatar = await step.run(
      "GenerateAvatar",
      async () => {
        const poll = async (retries = 80, interval = 5000) => {
          for (let i = 0; i < retries; i++) {
            const pollRes = await axios.get(
              "https://openapi.akool.com/api/open/v3/content/video/infobymodelid?video_model_id=" + CreateAvatarId,
              {
                headers: {
                  "x-api-key": process.env.AKOOL_API_TOKEN,
                  "Content-Type": "application/json",
                },
              }
            );
            const status = pollRes?.data?.data?.video_status
            if (status === 3) {
              return pollRes.data.data.video;// Audio is Ready
            }
            else if (status == 4) {
              throw new Error("Audio processing failed");
            }

            await new Promise(resolve => setTimeout(resolve, interval))

          }


        }
        const avatarVideoUrl = await poll();
        return avatarVideoUrl;
      }
    )

    // Save/ Update to Our DB

    const UpdateToDb = await step.run(
      "UpdateToDb",
      async () => {
        const result = await convex.mutation(api.videoData.UpdateAvatarUrl, {
          vId: videoRecordId,
          avatarUrl: GenerateAvatar,
          status: 2
        })
      }
    )
  }
)
