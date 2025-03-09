
import { useState } from "react";
import Navbar from "@/components/header/navbar";

export default function ImageCombiner() {
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [charFile, setCharFile] = useState<File | null>(null);
  const [combinedImage, setCombinedImage] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!bgFile || !charFile) {
      alert("Please select both background and character images.");
      return;
    }

    const formData = new FormData();
    formData.append("background", bgFile);
    formData.append("character", charFile);

    try {
      const response = await fetch("/api/combine", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to combine images.");
      }

      const blob = await response.blob();
      setCombinedImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    }
  };

  return (
    <div>
      <Navbar />
      <strong>Combine Images</strong>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setBgFile(e.target.files ? e.target.files[0] : null)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCharFile(e.target.files ? e.target.files[0] : null)}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Combine
      </button>
      {combinedImage && <img src={combinedImage} alt="Combined" />}
      <hr className="mt-4" />
    </div>
  );
  
}
