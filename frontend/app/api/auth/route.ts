import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import IPFS_NFT_ABI from "@/contracts/IPFS_NFT.json";

// Replace with your actual contract addresses from Mint page
const contracts = [
  "0xB1Af9E247d97a2fdc9d790Be473D8C2314141697",
  "0x6ae1c68f83a321eb35d6cbdd4959925725d8b532",
  "0x9a5e4b8aee1148bfe1f90d09d0670dd30ad77515",
];

// Example: connect to Sepolia
const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

/** 
 * Returns true if the address owns at least 1 NFT 
 * from any of the contracts above.
 */
async function checkNFTOwnership(address: string): Promise<boolean> {
  for (const contractAddress of contracts) {
    const contract = new ethers.Contract(contractAddress, IPFS_NFT_ABI, provider);
    const balance = await contract.balanceOf(address);
    if (balance.gt(0)) {
      return true;
    }
  }
  return false;
}

// Because this is a single "route.ts" file in Next.js App Router,
// we can handle multiple methods if needed, but let's just do POST.
export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address) {
      return NextResponse.json({ error: "No address provided" }, { status: 400 });
    }

    // 1. Check if the address owns an NFT
    const hasNFT = await checkNFTOwnership(address);
    if (!hasNFT) {
      return NextResponse.json({ error: "No NFT" }, { status: 403 });
    }

    // 2. If the user has an NFT, set the authToken cookie
    const tokenPayload = { address, nftFlag: true };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

    const response = NextResponse.json({ success: true });
    response.cookies.set("authToken", token, {
      httpOnly: true,
      maxAge: 60 * 60, // 1 hour
      path: "/", 
    });
    return response;
  } catch (err: any) {
    console.error("Error verifying NFT ownership:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
