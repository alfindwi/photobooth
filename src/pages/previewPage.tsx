import { useEffect, useState } from "react";
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

  return (
    <div className="flex justify-center mt-10">
      <div className="relative w-[320px] h-[800px] rounded-xl overflow-hidden shadow-lg bg-black">
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

        <img
          src={template.img}
          alt="Template overlay"
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
        />
      </div>
    </div>
  );
}
