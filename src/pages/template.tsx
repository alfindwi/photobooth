import { IoCameraOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Template {
  id: number;
  name: string;
  slug: string;
  img: string;
}

export function Template() {
  const [template, setTemplate] = useState([] as Template[]);

  useEffect(() => {
    fetch("https://api.npoint.io/b6d7f97e0c41ebb97c7b")
      .then((res) => res.json())
      .then((data) => setTemplate(data));
  }, []);
  return (
    <div>
      <div className="flex flex-col items-center">
        <p className="text-4xl sm:text-5xl font-extrabold text-[#D72323] tracking-tight leading-tight">
          Pilih Template Foto Favoritmu
        </p>
        <p className="text-sm text-[#4B4B4B] mt-4 font-medium">
          Rayakan momen spesial kemerdekaan dengan photobooth bertema merah
          putih. Pilih template yang kamu suka, ambil foto langsung dari kamera,
          dan unduh hasilnya!
        </p>
      </div>

      <div className="grid grid-cols-2 cursor-pointer sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-8">
        {template.map((templates) => (
          <Link
            to={`/camera/${templates.slug}`}
            key={templates.id}
            className="bg-white group border hover:scale-105 duration-300 border-[#efefef] 
                 rounded-xl shadow-md overflow-hidden w-full"
          >
            <div className="relative w-full h-[350px] bg-white">
              <img
                src={templates.img}
                alt="template"
                className="w-full h-full group-hover:scale-105 duration-300 object-contain p-4"
              />
            </div>

            <div className="p-4">
              <h3
                className="text-[#272343] font-semibold md:text-md xl:text-xl"
                style={{ fontFamily: "Roboto" }}
              >
                {templates.name}
              </h3>
              <button
                style={{ fontFamily: "Roboto" }}
                className="mt-4 w-full flex items-center bg-[#FF6F91] text-white cursor-pointer justify-center gap-2 px-4 py-2 text-md 
                 border border-[#c4c4c4] group-hover:bg-black group-hover:border-none 
                     group-hover:text-white font-semibold rounded-lg transition"
              >
                <IoCameraOutline size={20} /> Start
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
