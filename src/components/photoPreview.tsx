import { FaCropSimple } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

interface PhotoPreviewProps {
  photos: string[];
  onReset: () => void;
  onNext: () => void;
  canNext: boolean;
  handleDelete: (index: number) => void;
  handleCrop: (index: number) => void;
}

export default function PhotoPreview({
  photos,
  onReset,
  onNext,
  canNext,
  handleDelete,
  handleCrop,
}: PhotoPreviewProps) {
  return (
    <div className="flex flex-col items-start py-4 px-4 bg-white rounded-2xl shadow-lg border border-gray-100 w-full md:w-[480px] gap-7">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl text-[#9a0002] font-bold">Preview Foto</h1>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  photos.length >= i ? "bg-[#9a0002] shadow-sm" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2 font-medium">
            {photos.length}/3
          </span>
        </div>
      </div>

      {photos.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4 w-[320px] md:w-[400px] sm:w-[600px] sm:mx-auto bg-[#edf5fd] border border-[#ebebeb] px-4 py-4 rounded-md">
            {photos.map((url, i) => (
              <div className="relative w-full h-full group">
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div
                  onClick={() => handleDelete(i)}
                  className="bg-white/60 w-[30px] h-[30px] rounded-full absolute bottom-1 right-1 flex items-center justify-center"
                >
                  <MdDelete
                    size={16}
                    className="text-[#9a0002] cursor-pointer"
                  />
                </div>
                <div
                  onClick={() => handleCrop(i)}
                  className="bg-white/60 w-[30px] h-[30px] rounded-full absolute bottom-1 right-10 flex items-center justify-center"
                >
                  <FaCropSimple
                    size={16}
                    className="text-[#9a0002] cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full text-center text-[#757b88] py-12 border border-[#ebebeb] bg-[#edf5fd] rounded-md">
          Foto tidak ada
        </div>
      )}

      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={onReset}
          disabled={photos.length === 0}
          className={`w-full flex items-center justify-center gap-3 px-2 py-2 rounded-2xl font-bold text-lg transition-all duration-300 ${
            !canNext
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#9a0002] to-[#cc0003] hover:from-[#cc0003] hover:to-[#9a0002] "
          }`}
        >
          Hapus Semua
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className={`w-full flex items-center justify-center gap-3 px-2 py-2 rounded-2xl font-bold text-lg transition-all duration-300 ${
            !canNext
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#9a0002] to-[#cc0003] hover:from-[#cc0003] hover:to-[#9a0002] "
          }`}
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}
