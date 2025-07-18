import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
interface PhotoPosition {
  top: string;
  left: string;
  width: string;
  height: string;
}

interface Template {
  id: number;
  name: string;
  slug: string;
  img: string;
  position: PhotoPosition[];
}

export default function PreviewPage() {
  const { slug } = useParams();
  const [template, setTemplate] = useState<Template | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("https://api.npoint.io/b6d7f97e0c41ebb97c7b")
      .then((res) => res.json())
      .then((data: Template[]) => {
        const selected = data.find((item) => item.slug === slug);
        if (selected) {
          setTemplate(selected);
        } else {
          alert("Template tidak ditemukan");
        }
      });

    const storedPhotos = localStorage.getItem("capturedPhotos");
    if (storedPhotos) {
      setPhotos(JSON.parse(storedPhotos));
    }
  }, [slug]);

  if (!template) return <p>Loading...</p>;

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !template) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 320;
    canvas.height = 800;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });

    for (let idx = 0; idx < template.position.length; idx++) {
      const pos = template.position[idx];
      const photoSrc = photos[idx];
      if (!photoSrc || !pos) continue;

      try {
        const img = await loadImage(photoSrc);

        const x = pos.left.endsWith("%")
          ? (canvas.width * parseInt(pos.left)) / 100 - parseInt(pos.width) / 2
          : parseInt(pos.left);

        const y = parseInt(pos.top);
        const targetWidth = parseInt(pos.width);
        const targetHeight = parseInt(pos.height);

        // Aspect ratio crop - like object-fit: cover
        const imgRatio = img.width / img.height;
        const targetRatio = targetWidth / targetHeight;

        let sx = 0,
          sy = 0,
          sw = img.width,
          sh = img.height;

        if (imgRatio > targetRatio) {
          // Image is wider than target area
          sw = img.height * targetRatio;
          sx = (img.width - sw) / 2;
        } else {
          // Image is taller than target area
          sh = img.width / targetRatio;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, x, y, targetWidth, targetHeight);
      } catch (err) {
        console.error(`Gagal memuat gambar ke-${idx}`, err);
      }
    }

    try {
      const overlay = await loadImage(template.img);
      ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/png");
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isIOS) {
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`<img src="${dataUrl}" style="width:100%">`);
        } else {
          alert(
            "Silakan aktifkan pop-up di browser Anda untuk menyimpan gambar."
          );
        }
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `KARNATESA_${Math.floor(Math.random() * 1000)}.png`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Gagal memuat overlay template", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-5">
      <div className="relative w-[320px] h-[800px] rounded-xl overflow-hidden shadow-lg bg-black transform scale-90 sm:scale-100 mb-2 sm:mb-5">
        {template.position &&
          photos.slice(0, template.position.length).map((photo, idx) => {
            const pos = template.position[idx];
            if (!pos) return null;

            return (
              <img
                key={idx}
                src={photo}
                alt={`photo-${idx}`}
                className="absolute object-cover z-10 rounded-md"
                style={{
                  top: pos.top,
                  left: pos.left,
                  width: pos.width,
                  height: pos.height,
                  transform: "translateX(-50%)",
                }}
              />
            );
          })}
        <canvas ref={canvasRef} className="hidden" />

        <img
          src={template.img}
          alt="Template overlay"
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
        />
      </div>

      <button
        onClick={handleDownload}
        className="bg-[#9a0002] w-[250px] md:w-[300px] text-white px-4 py-2 rounded hover:bg-red-700 transition shadow"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        Download your photo
      </button>
      <a href="/" className="text-[#9a0002] mt-2">
        Pilih template lain
      </a>
    </div>
  );
}
