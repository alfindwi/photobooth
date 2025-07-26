import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Template {
  id: number;
  name: string;
  slug: string;
  img: string;
}

export function Template() {
  const [template, setTemplate] = useState([] as Template[])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://api.npoint.io/acfa037961d19a2c8985")
      .then((res) => res.json())
      .then((data) => {
        setTemplate(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="px-10 py-10">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-96 animate-pulse mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-80 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-[350px] bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="px-10 py-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="relative mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#9a0002] via-[#cc0003] to-[#9a0002] tracking-tight leading-tight">
              Pilih Template Favorit Anda
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9a0002]/20 via-transparent to-[#9a0002]/20 blur-sm -z-10 rounded-lg"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="text-sm md:text-base text-[#4B4B4B] font-medium leading-relaxed">
              Rayakan momen spesial{" "}
              <span className=" font-semibold bg-gradient-to-r from-[#9a0002] to-[#cc0003] bg-clip-text text-transparent">
                Hari Kemerdekaan
              </span>{" "}
              ini dengan template foto bertema merah-putih kami. Pilih template favorit Anda, ambil foto langsung dari
              kamera Anda, dan unduh hasilnya langsung!
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="flex items-center gap-3 mt-8">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-[#9a0002] to-transparent rounded-full"></div>
            <div className="w-2 h-2 bg-[#9a0002] rounded-full animate-pulse shadow-lg shadow-[#9a0002]/30"></div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-[#9a0002] to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {template.map((templates, index) => (
            <Link
              to={`/camera/${templates.slug}`}
              key={templates.id}
              className="group block transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <div className="bg-white border border-gray-100 hover:border-[#9a0002]/30 rounded-xl shadow-md hover:shadow-2xl hover:shadow-[#9a0002]/10 overflow-hidden w-full transition-all duration-100 backdrop-blur-sm">
                {/* Image Container */}
                <div className="relative w-full h-[350px] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
                  <img
                    src={templates.img || "/placeholder.svg"}
                    alt={templates.name}
                    className="w-full h-full group-hover:scale-110 duration-100 object-contain p-4 transition-transform"
                  />

                </div>

                {/* Content */}
                <div className="p-4 bg-gradient-to-b from-white to-gray-50/50">
                  <h3
                    className="text-[#9a0002] font-semibold md:text-md xl:text-xl mb-4 group-hover:text-[#cc0003] transition-colors duration-300 line-clamp-2"
                    style={{ fontFamily: "Roboto" }}
                  >
                    {templates.name}
                  </h3>

                  <button className="w-full flex items-center bg-gradient-to-r from-[#9a0002] to-[#cc0003] hover:from-[#cc0003] hover:to-[#9a0002] text-white cursor-pointer justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl group-hover:shadow-[#9a0002]/25 border-0">
                    <span>Mulai</span>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
