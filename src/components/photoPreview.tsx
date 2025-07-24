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
    <div className="flex flex-col items-start py-4 px-4 bg-[#f8fafc] shadow border border-[#edf5fd] rounded-md w-full md:w-[480px] gap-7">
      <h1 className="text-2xl text-[#9a0002] font-bold">Preview</h1>

      {photos.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4 w-[320px] md:w-[400px] sm:w-[600px] sm:mx-auto bg-[#edf5fd] border border-[#ebebeb] px-4 py-4 rounded-md">
            {photos.map((url, i) => (
              <div className="relative" key={i}>
                <img
                  src={url}
                  alt={`Foto ${i + 1}`}
                  className=" object-contain rounded"
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
                <div onClick={() => handleCrop(i)} className="bg-white/60 w-[30px] h-[30px] rounded-full absolute bottom-1 right-10 flex items-center justify-center">
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
          className={`bg-[#f2f1f1] text-[#9a0002] font-medium border border-[#ebebeb] px-4 py-2 rounded w-full ${
            photos.length === 0
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "cursor-pointer"
          }`}
        >
          Hapus Foto
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className={`text-white px-4 py-2 rounded w-full ${
            canNext
              ? "bg-[#9a0002] cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
