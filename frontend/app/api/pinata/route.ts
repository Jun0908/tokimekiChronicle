import { NextResponse, NextRequest } from "next/server";
import { PinataSDK } from "pinata";

export const runtime = "nodejs";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const { cid } = await pinata.upload.file(file);
    const url = await pinata.gateways.createSignedURL({
      cid: cid,
      expires: 3600,
    });
    // Return both cid and url
    return NextResponse.json({ cid, url }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


