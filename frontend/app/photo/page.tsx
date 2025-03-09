"use client";

import ImageCombiner from "@/components/photo/ImageCombiner";
import PinataFileUpload from "@/components/photo/PinataFileUpload";
import NFTMinting from "@/components/photo/NFTMinting";

export default function Home() {
  return (
    <div className="flex flex-col space-y-0">
      <ImageCombiner />
      <PinataFileUpload />
      <NFTMinting />
    </div>
  );
}

