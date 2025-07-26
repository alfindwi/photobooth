export default function TimerOverlay({ time }: { time: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg z-20">
      <div className=" rounded-full w-24 h-24 flex items-center justify-center shadow-2xl">
        <span className="text-4xl font-bold text-white animate-pulse">
          {time}
        </span>
      </div>
    </div>
  );
}
