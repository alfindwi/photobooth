"use client";

import type React from "react";
import { useRef } from "react";

export default function UploadButton({
  onPhotosSelected,
}: {
  onPhotosSelected: (photos: string[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (files.length === 0) return;

    const fileArray = Array.from(files).slice(0, 3);

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/heic",
      "image/heif",
    ];
    const validFiles = fileArray.filter((file) => {
      const isValid = validTypes.some(
        (type) =>
          file.type.toLowerCase().includes(type.split("/")[1]) ||
          file.name.toLowerCase().endsWith(`.${type.split("/")[1]}`)
      );
      return isValid;
    });

    if (validFiles.length === 0) {
      alert("Format file tidak didukung. Gunakan JPG, PNG, atau HEIC");
      e.target.value = "";
      return;
    }

    const promises = validFiles.map((file, index) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to read file as string"));
          }
        };

        reader.onerror = (error) => {
          console.error(`Error reading file ${index + 1}:`, error);
          reject(error);
        };

        setTimeout(() => {
          reject(new Error("File reading timeout"));
        }, 10000);

        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((base64Images) => {
        // Pastikan ada hasil
        if (base64Images.length > 0) {
          onPhotosSelected(base64Images);
        } else {
          alert("Tidak ada foto yang berhasil diproses");
        }
        e.target.value = "";
      })
      .catch((err) => {
        console.error("Gagal membaca file:", err);
        alert("Gagal memproses foto. Coba lagi atau gunakan foto lain.");
        e.target.value = "";
      });
  };
  return (
    <div className="flex flex-col justify-center items-center mb-8">
      <button
        onClick={handleClick}
        className="group relative bg-gradient-to-r from-[#9a0002] via-[#cc0003] to-[#9a0002] hover:from-[#cc0003] hover:via-[#9a0002] hover:to-[#cc0003] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-[#9a0002]/30 transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <span className="relative z-10 flex items-center justify-center gap-3">
          Upload Foto
        </span>
      </button>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          handleFileChange(e);
          e.target.value = "";
        }}
      />

      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap justify-center gap-3 text-center">
          <div className="bg-gradient-to-r from-red-50 to-white px-3 py-2 rounded-lg shadow-sm border border-red-100/50">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-gray-700">
                Maksimal 3 foto Format: JPG, PNG
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
