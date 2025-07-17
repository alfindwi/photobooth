

export default function TimerOverlay({ time }: { time: number }) {
  return (
    <div className="text-6xl font-bold text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {time}
    </div>
  );
}