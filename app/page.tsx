"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";

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
    <main className="min-h-screen bg-black bg-[radial-gradient(#222,transparent_1px)] [background-size:8px_8px] text-white flex flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      <img src="/logo.svg" alt="Hikari AI" className="w-14 h-14 mb-4" />

      {/* Headings */}
      <h1 className="text-4xl font-bold text-yellow-400 mb-1">Hikari AI</h1>
      <p className="text-gray-400 text-sm mb-8">Sharpen Reality. Amplify Light.</p>

      {/* Upload Container */}
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 p-5 rounded-xl shadow-lg transition-all">
        {/* Upload Area */}
        <label
          htmlFor="imageUpload"
          className="flex items-center justify-center gap-2 w-full p-3 bg-gray-800 hover:bg-gray-700 cursor-pointer text-sm text-gray-300 rounded-md transition mb-4"
        >
          <UploadCloud className="w-4 h-4" />
          {file ? "Image selected" : "Choose an image to upscale"}
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

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Upscaling...
            </>
          ) : (
            "Upscale Image"
          )}
        </Button>

        {/* Loader Spinner */}
        {loading && (
          <div className="mt-4 text-center text-sm text-gray-400 animate-pulse">
            Processing your image...
          </div>
        )}
      </div>

      {/* Preview Section */}
      {previewURL && (
        <div className="mt-8 transition-opacity duration-500 animate-fadeIn">
          <h3 className="text-center text-gray-300 mb-2">Preview</h3>
          <img
            src={previewURL}
            className="max-w-full border border-gray-600 rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Result Section */}
      {imageURL && (
        <div className="mt-8 transition-opacity duration-500 animate-fadeIn">
          <h3 className="text-center text-gray-300 mb-2">Upscaled Result</h3>
          <img
            src={imageURL}
            className="max-w-full border border-yellow-500 rounded-lg shadow-md"
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

      {/* Footer */}
      <footer className="text-xs text-gray-500 mt-10 text-center">
        All rights reserved © Hikari AI 2025
      </footer>
    </main>
  );
}
