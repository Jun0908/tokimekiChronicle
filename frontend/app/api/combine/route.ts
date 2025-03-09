import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Parse the form data using Next.js built-in method
    const formData = await req.formData();

    // Get the files from the form data. These are Web File objects.
    const backgroundFile = formData.get("background") as File;
    const characterFile = formData.get("character") as File;

    if (!backgroundFile || !characterFile) {
      return NextResponse.json(
        { message: "Required images are missing." },
        { status: 400 }
      );
    }

    // Convert the web File objects to Node.js Buffers
    const backgroundBuffer = Buffer.from(await backgroundFile.arrayBuffer());
    const characterBuffer = Buffer.from(await characterFile.arrayBuffer());

    // Get background image dimensions
    const backgroundMetadata = await sharp(backgroundBuffer).metadata();
    const bgWidth = backgroundMetadata.width || 800;
    const bgHeight = backgroundMetadata.height || 600;

    // Resize the character image so it fits within the background
    const resizedCharacterBuffer = await sharp(characterBuffer)
      .resize({ width: bgWidth, height: bgHeight, fit: "inside" })
      .toBuffer();

    // Composite the resized character image onto the background (centered)
    const compositeBuffer = await sharp(backgroundBuffer)
      .composite([{ input: resizedCharacterBuffer, gravity: "center" }])
      .png()
      .toBuffer();

    return new NextResponse(compositeBuffer, {
      status: 200,
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Server error during image processing." },
      { status: 500 }
    );
  }
}





