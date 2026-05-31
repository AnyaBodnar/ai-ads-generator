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
      "https://openapi.akool.com/api/open/v3/avatar/list?from=2&type=1&page=1&size=100",
      {
        headers: {
          "x-api-key": process.env.AKOOL_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: result.data?.data?.result ?? [],
      count: result.data?.data?.count ?? 0,
    });
  } catch (error) {
    console.error(
      "Get avatar list error:",
      error.response?.data || error.message
    );

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