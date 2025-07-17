import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { IoCameraOutline } from "react-icons/io5";

interface Template {
  id: number;
  name: string;
  slug: string;
  img: string;
}

export function CameraPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [photoURL, setPhotoUrl] = useState<string[]>([]);
  const [isCameraReady, setIsCameraReady] = useState(false);

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
          setIsCameraReady(true);
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
        alert("Kamera belum siap! Coba lagi.");
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;

      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/png");
      setPhotoUrl((prev) => [imageData, ...prev.slice(0, 2)]);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <p className="text-4xl sm:text-5xl font-extrabold text-[#D72323] tracking-tight leading-tight">
          Ambil Foto dengan Template
        </p>
        <p className="text-sm text-[#4B4B4B] mt-4 font-medium max-w-md text-center">
          Template: <span className="font-semibold">{template?.name}</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-10 w-full items-start">
        <div className="flex flex-col w-full md:w-[600px] items-start gap-6 relative">
          <div className="relative w-full">
            <div className="relative w-[600px] h-[380px]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full rounded-lg shadow scale-x-[-1] object-cover"
              />
            </div>
          </div>

          <button
            onClick={handleCapture}
            style={{ fontFamily: "Roboto" }}
            disabled={!isCameraReady}
            className={`z-10 relative w-full flex items-center justify-center gap-2
              px-6 py-2 rounded-md font-semibold text-md transition
              ${
                isCameraReady
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
          >
            <IoCameraOutline size={20} />
            Take Photo
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex flex-col items-start py-4 px-4 bg-[#f8fafc] shadow border border-[#edf5fd] rounded-md w-full md:w-[400px] gap-4">
          <div className="flex items-start gap-2">
            <h1 className="text-2xl text-black font-bold">Foto</h1>
          </div>

          {photoURL.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-3 w-full bg-[#edf5fd] border border-[#ebebeb] px-4 py-4 rounded-md">
              {photoURL.map((url, i) => (
                <div key={i} className="rounded shadow overflow-hidden">
                  <img
                    src={url}
                    alt={`Foto ${i + 1}`}
                    className="w-[100px] h-auto object-contain rounded"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full bg-[#edf5fd] border border-[#ebebeb] px-4 py-12 rounded-md">
              <p
                className="text-[#757b88] text-md"
                style={{ fontFamily: "Roboto" }}
              >
                Foto Tidak Tersedia
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full mt-2">
            <button
              onClick={resetPhoto}
              style={{ fontFamily: "Roboto" }}
              className="bg-[#f2f1f1] text-black font-medium border border-[#ebebeb] px-4 py-2 rounded w-full"
            >
              Reset Photo
            </button>
            <button
              onClick={handleNext}
              className="bg-[#0074C1] text-white px-4 py-2 rounded w-full"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
