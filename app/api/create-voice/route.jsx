import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { script, voiceId } = await req.json();

    console.log("Create voice request:", {
      script,
      voiceId,
    });

    if (!process.env.AKOOL_API_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: "AKOOL_API_TOKEN is missing",
        },
        { status: 500 }
      );
    }

    if (!script || typeof script !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "script is missing or invalid",
        },
        { status: 400 }
      );
    }

    if (!voiceId) {
      return NextResponse.json(
        {
          success: false,
          error: "voiceId is missing",
        },
        { status: 400 }
      );
    }

    const result = await axios.post(
      "https://openapi.akool.com/api/open/v3/audio/create",
      {
        input_text: script,
        voice_id: voiceId,
        rate: "100%",
      },
      {
        headers: {
          "x-api-key": process.env.AKOOL_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const generateVoiceId = result?.data?.data?._id;

    if (!generateVoiceId) {
      return NextResponse.json(
        {
          success: false,
          error: "Akool did not return generated voice id",
          raw: result.data,
        },
        { status: 500 }
      );
    }

    const poll = async (retries = 30, interval = 3000) => {
      for (let i = 0; i < retries; i++) {
        const pollRes = await axios.get(
          "https://openapi.akool.com/api/open/v3/audio/infobymodelid?audio_model_id=" +
            generateVoiceId,
          {
            headers: {
              "x-api-key": process.env.AKOOL_API_TOKEN,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Akool audio poll response:", pollRes.data);

        const status = pollRes?.data?.data?.status;

        if (status === 3) {
          return pollRes.data.data.url;
        }

        if (status === 4) {
          throw new Error(
            "Audio processing failed: " + JSON.stringify(pollRes.data)
          );
        }

        await new Promise((resolve) => setTimeout(resolve, interval));
      }

      throw new Error("Audio was not ready after polling timeout");
    };

    const audioUrl = await poll();

    if (!audioUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Akool returned empty audio URL",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      audioUrl,
    });
  } catch (error) {
    console.error("Create voice error:", error.response?.data || error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.response?.data || error.message,
      },
      {
        status: error.response?.status || 500,
      }
    );
  }
}