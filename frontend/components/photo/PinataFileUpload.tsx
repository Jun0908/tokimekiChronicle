"use client";

import { useState, useRef } from "react";

export default function PinataFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const inputFile = useRef<HTMLInputElement | null>(null);

  const uploadFile = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/pinata", {
        method: "POST",
        body: data,
      });
      const { cid, url } = await uploadRequest.json();
      setCid(cid);
      setUrl(url);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div >
      <strong>Pinata File Upload</strong>
      <input
        type="file"
        ref={inputFile}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={uploadFile}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={!file || uploading}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
      {url && (
        <div className="mt-2">
          <a href={url} target="_blank" rel="noopener noreferrer">
            View Uploaded File
          </a>
        </div>
      )}
      {cid && (
        <div className="mt-2">
          <p>CID: {cid}</p>
        </div>
      )}
      <hr className="mt-4" />
    </div>
    
  );
}
