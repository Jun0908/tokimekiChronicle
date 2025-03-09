import React from "react";
import Navbar from "@/components/header/navbar";

export default function Home() {
  return (
    <div className="relative w-full h-screen ">
       <Navbar />
      <div className="relative inline-block h-full">
        {/* Map Image */}
        <img
          src="/bg.png"
          alt="Map"
          className="h-full w-auto"
        />

        {/* School  */}
        <div
          className="absolute"
          style={{ left: "20%", top: "40%" }}
        >
          <a
            href="/school"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/icon1.jpg"
              alt="Icon 1"
              className="w-7 h-7"  // specify icon size
            />
          </a>
        </div>


        {/* Station */}
        <div
          className="absolute"
          style={{ left: "84%", top: "14%" }}
        >
          <a
            href="station"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/icon2.jpg"
              alt="Icon 2"
              className="w-7 h-7" // specify a different icon size
            />
          </a>
        </div>

        {/* Temple */}
        <div
          className="absolute"
          style={{ left: "28%", top: "48%" }}
        >
          <a
            href="temple"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/temple.jpg"
              alt="Icon 2"
              className="w-7 h-7" // specify a different icon size
            />
          </a>
        </div>

      </div>
    </div>
  );
}


