import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!process.env.AKOOL_API_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: "AKOOL_API_TOKEN is missing in .env.local",
        },
        { status: 500 }
      );
    }

    const result = await axios.get(
      "https://openapi.akool.com/api/open/v3/voice/list",
      {
        headers: {
          "x-api-key": process.env.AKOOL_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );
    return NextResponse.json({
      success: result.data?.code === 1000,
      data: result.data?.data ?? [],
      raw: result.data,
    });
  } catch (error) {
    console.error("Get voice list error:", error.response?.data || error.message);

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