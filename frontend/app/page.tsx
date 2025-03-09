import React from "react";

export default function Home() {
  return (
    <div className="relative w-full h-screen ">
      <div className="relative inline-block h-full">
        {/* Link to destination */}
        <a href="map" target="_blank" rel="noopener noreferrer">
          {/* Map Image */}
          <img
            src="/front.png"
            alt="Map"
            className="h-full w-auto cursor-pointer"
          />
        </a>
      </div>
    </div>
  );
}
