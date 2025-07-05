"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [previewURL, setPreviewURL] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("https://tree1.sahajsharma921.workers.dev", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upscaling failed");

      const blob = await response.blob();
      const imageBlobUrl = URL.createObjectURL(blob);
      setImageURL(imageBlobUrl);
    } catch (error) {
      alert("Something went wrong. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-12 text-white"
      style={{
        backgroundColor: "#0f0f0f",
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 5px)",
        animation: "bgMove 40s linear infinite",
        backgroundSize: "150% 150%",
      }}
    >
      {/* Animated background style */}
      <style>{`
        @keyframes bgMove {
          from { background-position: 0 0; }
          to { background-position: 100px 100px; }
        }
      `}</style>

      {/* Logo */}
      <img src="/logo.svg" alt="Hikari AI" className="w-14 h-14 mb-4" />

      {/* Header */}
      <h1 className="text-4xl font-bold text-yellow-400 mb-1">Hikari AI</h1>
      <p className="text-sm text-gray-400 mb-8">Sharpen Reality. Amplify Light.</p>

      {/* Upload Card */}
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg space-y-4">
        <label
          htmlFor="imageUpload"
          className="flex items-center justify-center gap-2 w-full p-3 bg-gray-800 hover:bg-gray-700 cursor-pointer text-sm text-gray-300 rounded-md transition"
        >
          <UploadCloud className="w-4 h-4" />
          {file ? "Image Selected" : "Choose an image to upscale"}
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) {
              setFile(selected);
              setPreviewURL(URL.createObjectURL(selected));
              setImageURL("");
            }
          }}
        />

        <Button
          onClick={handleUpload}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold transition rounded-md"
        >
          Upscale Image
        </Button>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Preview Section */}
      {previewURL && (
        <div className="mt-8 transition-opacity duration-500 animate-fadeIn">
          <h3 className="text-center text-gray-300 mb-2">Preview</h3>
          <img
            src={previewURL}
            className="max-w-full border border-gray-600 rounded-xl shadow-md"
          />
        </div>
      )}

      {/* Result Section */}
      {imageURL && (
        <div className="mt-8 transition-opacity duration-700 animate-fadeIn">
          <h3 className="text-center text-gray-300 mb-2">Upscaled Result</h3>
          <img
            src={imageURL}
            className="max-w-full border border-yellow-500 rounded-xl shadow-lg"
          />
          <a
            href={imageURL}
            download="hikari-upscaled.png"
            className="mt-4 inline-block bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded transition"
          >
            Download Image
          </a>
        </div>
      )}

      <footer className="text-xs text-gray-500 mt-10 text-center">
        All rights reserved © Hikari AI 2025
      </footer>
    </main>
  );
}
