import { NextResponse } from "next/server";
import { generatePixelArt } from "@/lib/image-generator";
import { isValidPrompt } from "@/lib/prompt";

export async function POST(request: Request) {
  let prompt: unknown;
  try {
    ({ prompt } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof prompt !== "string" || !isValidPrompt(prompt)) {
    return NextResponse.json(
      { error: "Enter a description of up to 300 characters." },
      { status: 400 },
    );
  }

  try {
    const image = await generatePixelArt(prompt);
    return NextResponse.json({ image });
  } catch {
    return NextResponse.json(
      { error: "Could not generate an image. Try again." },
      { status: 500 },
    );
  }
}
