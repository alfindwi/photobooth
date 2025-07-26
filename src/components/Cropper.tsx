import { useEffect, useRef, useState } from "react";
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
  onClose,
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

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
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

  useEffect(() => {
    setCrop({
      unit: "%",
      width: 50,
      height: 50,
      x: 25,
      y: 25,
    })
  }, [image])

  return (
    <div className="fixed inset-0  bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-gradient-to-br from-red-50 via-white to-red-50 rounded-lg p-4 shadow-xl w-[90vw] max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg">
        <div className="flex items-center justify-center">
          <p className="text-xl font-bold text-[#9a0002] mb-4">
            Biar makin estetik, crop dulu~
          </p>
        </div>

        <div className="p-6 to-red-50/20">
          <div className="w-full overflow-hidden rounded-xl shadow-inner flex items-center justify-center">
            <ReactCrop
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              ruleOfThirds
              aspect={120 / 77}
            >
              <img
                src={image || "/placeholder.svg"}
                ref={imageRef}
                alt="Crop"
                className="max-w-full max-h-[400px] object-contain mx-auto block"
              />
            </ReactCrop>
          </div>
        </div>

        <div className="px-6 py-5 ">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Batal
            </button>
            <button
              onClick={handleCrop}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#9a0002] to-[#cc0003] hover:from-[#cc0003] hover:to-[#9a0002] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#9a0002]/25 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {" "}
                Simpan
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
