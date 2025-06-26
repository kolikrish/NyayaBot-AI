import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    return NextResponse.json({
      apiKeyExists: !!apiKey,
      apiKeyFirstChars: apiKey ? apiKey.substring(0, 3) + "..." : null,
      allEnvVars: Object.keys(process.env).filter(key => !key.includes("NODE_"))
    });
  } catch (error) {
    console.error("Error in test route:", error);
    return NextResponse.json(
      { error: "An error occurred while testing" },
      { status: 500 }
    );
  }
}

