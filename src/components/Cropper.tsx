import { useRef, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type ImageCropperProps = {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onClose: () => void;
};

export default function ImageCropper({
  image,
  onCropComplete,
  onClose
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const imageRef = useRef<HTMLImageElement | null>(null);

  const getCroppedImg = (): string | null => {
    const image = imageRef.current;
    if (!image || !crop.width || !crop.height) return null;

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL("image/png");
  };

  const handleCrop = () => {
    const cropped = getCroppedImg();
    if (cropped) {
      onCropComplete(cropped);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 shadow-xl w-[90vw] max-w-md">
        <div className="flex items-center justify-center">
          <p className="text-xl font-bold text-[#9a0002] mb-4">
            Biar makin estetik, crop dulu~
          </p>
        </div>

        <div className="w-full overflow-hidden">
          <ReactCrop
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            ruleOfThirds
            aspect={120 / 77}
          >
            <img
              src={image}
              ref={imageRef}
              alt="Crop"
              className="w-full max-h-[300px] object-contain"
            />
          </ReactCrop>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={handleClose} className="px-4 py-2 cursor-pointer bg-white text-[#9a0002] border border-[#9a0002] rounded">
            Tutup
          </button>
          <button
            onClick={handleCrop}
            className="px-4 py-2 cursor-pointer bg-[#9a0002] text-white rounded"
          >
            Crop & Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
