import React, { useRef } from "react";

export default function UploadButton({ onPhotosSelected }: { onPhotosSelected: (photos: string[]) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files).slice(0, 3); // Max 3
    const promises = fileArray.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then(base64Images => {
        onPhotosSelected(base64Images);
      })
      .catch(err => {
        console.error("Gagal membaca file", err);
      });
  };

  return (
    <div className="flex justify-center items-center mb-5">
      <button
        onClick={handleClick}
        className="bg-gradient-to-r from-[#9a0002] to-[#cc0003] hover:from-[#cc0003] hover:to-[#9a0002] hover:scale-105 px-8 py-2 rounded-2xl font-bold text-lg transition-all duration-300"
      >
        Upload Foto
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
    </div>
  );
}
