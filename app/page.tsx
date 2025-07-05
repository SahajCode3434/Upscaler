"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HikariAIPage() {
  const [imageURL, setImageURL] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const preview = URL.createObjectURL(selected);
      setPreviewURL(preview);
      setImageURL("");
    }
  };

  const handleUpscale = async () => {
    if (!file) {
      alert("Please upload an image first.");
      return;
    }

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
      const upscaledURL = URL.createObjectURL(blob);
      setImageURL(upscaledURL);

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } catch (error) {
      alert("Upscale failed. Try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10 relative overflow-hidden">
      <style>{`
        @keyframes bgMove {
          from { background-position: 0 0; }
          to { background-position: 100px 100px; }
        }
      `}</style>

      {/* Background lines */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 6px)",
        backgroundSize: "150% 150%",
        animation: "bgMove 40s linear infinite",
      }} />

      {/* Audio */}
      <audio ref={audioRef} src="/chime.mp3" preload="auto" />

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center">
        <img
          src="/hakari-logo.png"
          alt="Hikari AI"
          className="w-14 h-14 mb-3 hover:drop-shadow-[0_0_10px_gold] transition"
        />
        <h1 className="text-4xl font-bold text-yellow-400 mb-1">Hikari AI</h1>
        <p className="text-sm text-gray-400 mb-8">Sharpen Reality. Amplify Light.</p>
      </div>

      {/* Upload Box */}
      <div className="relative z-10 w-full max-w-md bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg space-y-4">
        <label
          htmlFor="imageUpload"
          className="flex items-center justify-center gap-2 w-full p-3 bg-gray-800 hover:bg-gray-700 cursor-pointer text-sm text-gray-300 rounded-md transition"
        >
          <UploadCloud className="w-4 h-4" />
          {file ? "Image Selected" : "Choose an image to upscale"}
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <Button
          onClick={handleUpscale}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold transition rounded-md"
        >
          Upscale Image
        </Button>

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Preview */}
      {previewURL && (
        <div className="relative z-10 mt-8">
          <h3 className="text-center text-gray-300 mb-2">Preview</h3>
          <img
            src={previewURL}
            alt="Preview"
            className="max-w-full border border-gray-600 rounded-xl shadow-md"
          />
        </div>
      )}

      {/* Result */}
      {imageURL && (
        <div className="relative z-10 mt-8 animate-fadeIn">
          <h3 className="text-center text-gray-300 mb-2">Upscaled Result</h3>
          <img
            src={imageURL}
            alt="Upscaled"
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

      <footer className="relative z-10 text-xs text-gray-500 mt-12 text-center">
        All rights reserved © Hikari AI 2025
      </footer>
    </main>
  );
}
