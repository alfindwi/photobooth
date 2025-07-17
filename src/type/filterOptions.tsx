import { RxValueNone } from "react-icons/rx";

export const filterOptions = [
  { name: <RxValueNone size={20} />, value: "none" },
  { name: "BNW", value: "grayscale(100%)" },
  { name: "Sepia", value: "sepia(100%)" },
  { name: "Soft Bright", value: "blur(1px) brightness(1.1)" },
  { name: "Contrast Boost", value: "contrast(200%) saturate(120%)" },
];