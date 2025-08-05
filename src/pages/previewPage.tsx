"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";

interface Template {
  id: number;
  name: string;
  slug: string;
  img: string;
  position: Array<{
    top: string;
    left: string;
    width: string;
    height: string;
  }>;
}

export default function PreviewPage() {
  const { slug } = useParams();
  const [template, setTemplate] = useState<Template | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("https://api.npoint.io/acfa037961d19a2c8985")
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

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">
            Loading template...
          </p>
          <div className="mt-4 flex justify-center">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-[#9a0002] rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !template) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 3;
    const width = 320;
    const height = 800;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
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
          ? (width * Number.parseInt(pos.left)) / 100 -
            Number.parseInt(pos.width) / 2
          : Number.parseInt(pos.left);
        const y = Number.parseInt(pos.top);
        const targetWidth = Number.parseInt(pos.width);
        const targetHeight = Number.parseInt(pos.height);

        const imgRatio = img.width / img.height;
        const targetRatio = targetWidth / targetHeight;

        let sx = 0,
          sy = 0,
          sw = img.width,
          sh = img.height;
        if (imgRatio > targetRatio) {
          sw = img.height * targetRatio;
          sx = (img.width - sw) / 2;
        } else {
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
      ctx.drawImage(overlay, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/png");
      if (!dataUrl) {
        alert("Gagal membuat gambar dari canvas");
        return;
      }

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isIOS) {
        window.location.href = dataUrl;
        return;
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `KARNATESA_${Math.floor(Math.random() * 1000000)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (isMobile) {
          alert("Gambar berhasil diunduh. Cek galeri atau folder download.");
        }
      }
    } catch (err) {
      console.error("Gagal memuat overlay template", err);
      alert("Terjadi kesalahan saat membuat gambar.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-300 via-white to-red-50 px-10 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-100/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#9a0002] via-[#cc0003] to-[#9a0002] tracking-tight leading-tight mb-3">
            Preview Hasil Foto
          </h1>
          <p className="text-gray-600 font-medium max-w-md mx-auto">
            Lihat hasil foto Anda dengan template yang dipilih. Jika sudah puas,
            silakan download!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#9a0002] to-[#cc0003] rounded-full mx-auto mt-4"></div>
        </div>

        <div className="relative mb-8">
          <div className="relative w-[320px] h-[800px] rounded-2xl overflow-hidden shadow-2xl bg-black border-2 border-gray-700">
            {template.position &&
              photos.slice(0, template.position.length).map((photo, idx) => {
                const pos = template.position[idx];
                if (!pos) return null;

                return (
                  <img
                    key={idx}
                    src={photo || "/placeholder.svg"}
                    alt={`photo-${idx}`}
                    className="absolute object-cover z-10 rounded-md shadow-lg"
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
              src={template.img || "/placeholder.svg"}
              alt="Template overlay"
              className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            to="/"
            className="group flex items-center gap-2 text-[#9a0002] hover:text-[#cc0003] font-semibold transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl border border-red-100 hover:border-red-200"
          >
            Pilih Template Lain
          </Link>
          <button
            onClick={handleDownload}
            className="group relative bg-gradient-to-r from-[#9a0002] via-[#cc0003] to-[#9a0002] hover:from-[#cc0003] hover:via-[#9a0002] hover:to-[#cc0003] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-[#9a0002]/30 transition-all duration-300 w-[280px] sm:w-[320px] overflow-hidden"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Download Foto Kamu
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
