interface PhotoPreviewProps {
  photos: string[];
  onReset: () => void;
  onNext: () => void;
  canNext: boolean;
}

export default function PhotoPreview({ photos, onReset, onNext, canNext }: PhotoPreviewProps) {
  return (
    <div className="flex flex-col items-start py-4 px-4 bg-[#f8fafc] shadow border border-[#edf5fd] rounded-md w-full md:w-[400px] gap-4">
      <h1 className="text-2xl text-[#9a0002] font-bold">Preview</h1>

      {photos.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3 w-full bg-[#edf5fd] border border-[#ebebeb] px-4 py-4 rounded-md">
          {photos.map((url, i) => (
            <img key={i} src={url} alt={`Foto ${i + 1}`} className="w-[100px] object-contain rounded" />
          ))}
        </div>
      ) : (
        <div className="w-full text-center text-[#757b88] py-12 border border-[#ebebeb] bg-[#edf5fd] rounded-md">
          Photo will appear here
        </div>
      )}

      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={onReset}
          disabled={photos.length === 0}
          className={`bg-[#f2f1f1] text-[#9a0002] font-medium border border-[#ebebeb] px-4 py-2 rounded w-full ${
            photos.length === 0 ? "bg-gray-400 cursor-not-allowed text-white" : "cursor-pointer"
          }`}
        >
          Reset Photo
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className={`text-white px-4 py-2 rounded w-full ${
            canNext ? "bg-[#9a0002] cursor-pointer" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
