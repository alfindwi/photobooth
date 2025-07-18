import { useEffect, useRef, useState } from "react";
import { GoMirror } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/button";
import FilterButton from "../components/filterButton";
import PhotoPreview from "../components/photoPreview";
import TimerOverlay from "../components/timeOverlay";
import type { Template } from "../type/ITemplate";
import { filterOptions } from "../type/filterOptions";

export function CameraPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [_, setTemplate] = useState<Template | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [isShooting, setIsShooting] = useState(false);
  const [photoURL, setPhotoUrl] = useState<string[]>([]);
  const [filter, setFilter] = useState("none");

  const videoRef = useRef<HTMLVideoElement>(null);
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
  }, [slug]);

  useEffect(() => {
    let stream: MediaStream;

    navigator.mediaDevices.getUserMedia({ video: true }).then((s) => {
      stream = s;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = async () => {
          await new Promise((r) => setTimeout(r, 100));
          videoRef.current?.play();
        };
      }
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const resetPhoto = () => {
    setPhotoUrl([]);
  };

  const toggleMirror = () => {
    const video = videoRef.current;
    if (video) {
      video.style.transform =
        video.style.transform === "scale(-1, 1)" ? "" : "scale(-1, 1)";
    }
  };

  const handleNext = () => {
    if (photoURL.length < 3) {
      alert("Ambil 3 foto terlebih dahulu!");
      return;
    }

    localStorage.setItem("capturedPhotos", JSON.stringify(photoURL));
    navigate(`/preview/${slug}`);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const width = video.videoWidth;
      const height = video.videoHeight;

      if (!width || !height) {
        alert("Kamera belum siap! Izinkan akses kamera.");
        return;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        alert("Kamera belum siap! Izinkan akses kamera.");
        return;
      }

      ctx.filter = filter;
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      ctx.drawImage(video, 0, 0, width, height);

      const imageData = canvas.toDataURL("image/png");
      setPhotoUrl((prev) => [imageData, ...prev.slice(0, 2)]);
    }
  };

  const startPhotoSequence = async () => {
    if (isShooting || photoURL.length >= 3) return;
    setIsShooting(true);
    setPhotoUrl([]);

    for (let i = 0; i < 3; i++) {
      await new Promise<void>((resolve) => {
        let count = 3;
        setTimer(count);

        const interval = setInterval(() => {
          count -= 1;
          if (count <= 0) {
            clearInterval(interval);
            setTimer(null);
            handleCapture();
            resolve();
          } else {
            setTimer(count);
          }
        }, 1000);
      });

      await new Promise((res) => setTimeout(res, 500));
    }

    setIsShooting(false);
  };


  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center">
      <div className="flex flex-col items-center text-center">
        <p className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#9a0002] tracking-tight leading-tight">
          Capture Your Photo with a Template
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-10 w-full items-start">
        <div className="flex flex-col w-full md:w-[600px] items-start gap-6 relative">
          <div className="relative w-full">
            <div className="relative w-full max-w-[600px] h-[250px] sm:h-[300px] md:h-[380px] mx-auto">
              <video
                ref={videoRef}
                autoPlay
                style={{ filter }}
                playsInline
                className="w-full h-full rounded-lg shadow scale-x-[-1] object-cover"
              />
              {timer !== null && <TimerOverlay time={timer} />}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap justify-center w-full">
            {filterOptions.map((opt) => (
              <FilterButton
                key={opt.value}
                icon={opt.name}
                active={filter === opt.value}
                disabled={isShooting}
                onClick={() => setFilter(opt.value)}
                bgColor={opt.backgroundColor}
              />
            ))}
            <button
              disabled={isShooting}
              onClick={toggleMirror}
              className={`w-12 cursor-pointer border-gray-300 text-[#9a0002] h-12 flex items-center 
              justify-center rounded-full border-2 transition font-semibold text-xs ${
                isShooting
                  ? "bg-gray-300 text-white border-gray-300 cursor-not-allowed"
                  : "bg-white hover:bg-[#9a0002]/10"
              }`}
            >
              <GoMirror size={20} />
            </button>
          </div>

          <Button
            title={
              isShooting
                ? "Sedang Mengambil Foto"
                : photoURL.length >= 3
                ? "Semua foto sudah terambil!"
                : "Ambil Foto"
            }
            onClick={startPhotoSequence}
            disabled={isShooting || photoURL.length >= 3}
            className={`z-10 cursor-pointer relative w-full flex items-center justify-center gap-2
                      px-6 py-2 rounded-md font-semibold text-md transition ${
                        isShooting || photoURL.length >= 3
                          ? "bg-gray-400"
                          : "bg-[#9a0002]"
                      }
                      `}
          />
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <PhotoPreview
          photos={photoURL}
          onReset={resetPhoto}
          onNext={handleNext}
          canNext={photoURL.length >= 3}
        />
      </div>
    </div>
  );
}
