import { useEffect, useRef, useState } from "react";
import { GoMirror } from "react-icons/go";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/button";
import FilterButton from "../components/filterButton";
import ImageCropper from "../components/Cropper";
import PhotoPreview from "../components/photoPreview";
import TimerOverlay from "../components/timeOverlay";
import type { Template } from "../type/ITemplate";
import { filterOptions } from "../type/filterOptions";
import { IoMdArrowRoundBack } from "react-icons/io";

export function CameraPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [_, setTemplate] = useState<Template | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [isShooting, setIsShooting] = useState(false);
  const [photoURL, setPhotoUrl] = useState<string[]>([]);
  const [isPotrait, setIsPotrait] = useState(false);
  const [filter, setFilter] = useState("none");
  const [flash, setFlash] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPotrait(window.innerHeight > window.innerWidth);
    };

    const debounced = () => {
      setTimeout(checkOrientation, 300);
    };

    checkOrientation();
    window.addEventListener("resize", debounced);
    window.addEventListener("orientationchange", debounced);

    return () => {
      window.removeEventListener("resize", debounced);
      window.removeEventListener("orientationchange", debounced);
    };
  }, []);

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
  }, [isPotrait]);

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
    setFlash(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const originalWidth = video.videoWidth;
      const originalHeight = video.videoHeight;

      if (!originalWidth || !originalHeight) {
        alert("Kamera belum siap! Izinkan akses kamera.");
        return;
      }

      const targetAspect = 120 / 77;
      const videoAspect = originalWidth / originalHeight;

      let sx = 0,
        sy = 0,
        sWidth = originalWidth,
        sHeight = originalHeight;

      if (videoAspect > targetAspect) {
        sWidth = originalHeight * targetAspect;
        sx = (originalWidth - sWidth) / 2;
      } else {
        sHeight = originalWidth / targetAspect;
        sy = (originalHeight - sHeight) / 2;
      }

      canvas.width = sWidth;
      canvas.height = sHeight;

      ctx.filter = filter;
      ctx.setTransform(-1, 0, 0, 1, sWidth, 0);
      ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

      const imageData = canvas.toDataURL("image/png");
      setPhotoUrl((prev) => [imageData, ...prev.slice(0, 2)]);

      setTimeout(() => setFlash(false), 200);
    }
  };

  const handleStartCrop = (index: number) => {
    const photo = photoURL[index];
    setSelectedImage(photo);
    setIsCropping(true);
  };

  const handleCropComplete = (photoURL: string) => {
    setPhotoUrl((prev) =>
      prev.map((url) => (url === selectedImage ? photoURL : url))
    );
    setIsCropping(false);
    setSelectedImage(null);
  };

  const handleDelete = (index: number) => {
    setPhotoUrl((prev) => prev.filter((_, i) => i !== index));
  };

  const startPhotoSequence = async () => {
    if (isShooting || photoURL.length >= 3 || isPotrait) return;
    setIsShooting(true);

    const remaining = 3 - photoURL.length;

    for (let i = 0; i < remaining; i++) {
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

  const handleClose = () => {
    setIsCropping(false);
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center">
        <div className="relative w-full text-center mb-8 flex flex-col md:block">
          <Link
            to="/"
            className="mb-6 md:mb-0 md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 group"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 hover:border-[#9a0002] hover:shadow-xl group-hover:bg-red-50">
              <IoMdArrowRoundBack className="text-[#9a0002] text-2xl " />
            </div>
          </Link>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#9a0002] via-[#cc0003] to-[#9a0002] tracking-tight leading-tight mb-3">
              Ambil Foto dengan Template Pilihanmu
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#9a0002] to-[#cc0003] rounded-full mx-auto"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-6 w-full max-w-7xl items-start">
          <div className="flex flex-col w-full lg:w-[600px] items-start gap-6 relative">
            <div className="relative w-full">
              <div className="relative w-full max-w-[600px] aspect-[120/77] mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {isPotrait ? (
                  <div className="bg-black/10 shadow border h-full flex flex-col justify-center items-center border-[#edf5fd] p-4 rounded-md max-w-sm text-center">
                    <h1 className="text-2xl text-[#9a0002] font-bold mb-2">
                      Eh.. Layarnya HP-nya di putar dulu yaa!
                    </h1>
                    <p className="text-sm text-[#9a0002] font-medium">
                      Soalnya kalau nggak diputar, hasil fotonya bisa gepeng,
                      Biar foto kamu tetap kece dan terlihat bagus. diputar
                      layarnya yaa :D
                    </p>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    style={{ filter }}
                    playsInline
                    className="w-full h-full scale-x-[-1] object-cover"
                  />
                )}
                {timer !== null && <TimerOverlay time={timer} />}
                {flash && (
                  <div className="absolute top-0 left-0 w-full h-full bg-white animate-fadeOut z-10" />
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-[#9a0002] mb-4">
                  Filter & Kontrol
                </h3>
                <div className="flex gap-3 flex-wrap justify-center mb-4">
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
                    className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all duration-300 font-semibold text-xs ${
                      isShooting
                        ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                        : "bg-white text-[#9a0002] border-gray-200 hover:border-[#9a0002] hover:shadow-md hover:bg-red-50"
                    }`}
                  >
                    <GoMirror size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full">
              <Button
                title={
                  isShooting
                    ? "Sedang Mengambil Foto..."
                    : photoURL.length >= 3
                    ? "Semua foto sudah terambil!"
                    : `Ambil Foto (${photoURL.length}/3)`
                }
                onClick={startPhotoSequence}
                disabled={isShooting || isPotrait || photoURL.length >= 3}
                className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  isShooting || photoURL.length >= 3 || isPotrait
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#9a0002] to-[#cc0003] hover:from-[#cc0003] hover:to-[#9a0002] hover:scale-105"
                }`}
              />
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <PhotoPreview
            photos={photoURL}
            onReset={resetPhoto}
            onNext={handleNext}
            canNext={photoURL.length >= 3}
            handleDelete={handleDelete}
            handleCrop={handleStartCrop}
          />
        </div>

        {isCropping && selectedImage && (
          <ImageCropper
            onClose={handleClose}
            image={selectedImage}
            onCropComplete={handleCropComplete}
          />
        )}
      </div>

      <style>{`
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-fadeOut {
          animation: fadeOut 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
