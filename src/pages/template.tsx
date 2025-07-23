import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/button";

interface Template {
  id: number;
  name: string;
  slug: string;
  img: string;
}

export function Template() {
  const [template, setTemplate] = useState([] as Template[]);

  useEffect(() => {
    fetch("https://api.npoint.io/acfa037961d19a2c8985")
      .then((res) => res.json())
      .then((data) => setTemplate(data));
  }, []);
  return (
    <div className="px-10 py-10">
      <div className="flex flex-col items-center text-center ">
        <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#9a0002] tracking-tight leading-tight">
          Pilih Template favorit anda
        </p>
        <p className="text-sm text-[#4B4B4B] mt-4 font-medium text-center max-w-3xl">
          Rayakan momen spesial Hari Kemerdekaan ini dengan template foto bertema
          merah-putih kami. Pilih template favorit Anda, ambil foto langsung
          dari kamera Anda, dan unduh hasilnya langsung!
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
                className="text-[#9a0002] font-semibold md:text-md xl:text-xl"
                style={{ fontFamily: "Roboto" }}
              >
                {templates.name}
              </h3>
              <Button
                title="Start"
                className="mt-4 w-full flex items-center bg-[#9a0002] text-[#efe6fe] cursor-pointer justify-center gap-2 px-4 py-2 text-md 
                 border border-[#c4c4c4] group-hover:bg-[#9a0003] group-hover:border-none 
                     group-hover:text-[#efe6fe] font-semibold rounded-lg transition"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
