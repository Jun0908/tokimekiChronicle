"use client";

import React from "react";
import Navbar from "@/components/header/navbar";

export default function ImageGallery() {
  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* 画像ギャラリー */}
      <div className="flex-grow flex flex-col items-center justify-center gap-4 px-4">
        {/* Image 3 */}
        <div className="relative w-full max-w-4xl">
          <img
            src="/map3.jpg"
            alt="Map 3"
            className="w-full h-auto object-contain rounded-lg shadow-lg cursor-pointer hover:opacity-80"
          />
        </div>

        {/* Image 2 */}
        <div className="relative w-full max-w-4xl">
          <img
            src="/map2.jpg"
            alt="Map 2"
            className="w-full h-auto object-contain rounded-lg shadow-lg cursor-pointer hover:opacity-80"
          />
        </div>

        {/* Image 1 */}
        <div className="relative w-full max-w-4xl">
          <img
            src="/map1.jpg"
            alt="Map 1"
            className="w-full h-auto object-contain rounded-lg shadow-lg cursor-pointer hover:opacity-80"
          />
        </div>
      </div>

      {/* クリックアイコン */}
      <div className="absolute" style={{ left: "65%", top: "58%" }}>
        <a href="/principal" target="_blank" rel="noopener noreferrer">
          <img src="/icon1.jpg" alt="Icon 1" className="w-7 h-7" />
        </a>
      </div>

      <div className="absolute" style={{ left: "43%", top: "80%" }}>
        <a href="/llm-contact" target="_blank" rel="noopener noreferrer">
          <img src="/meat.jpg" alt="Icon 2" className="w-7 h-7" />
        </a>
      </div>
    </div>
  );
}
