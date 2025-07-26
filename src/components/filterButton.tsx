import React from "react";

interface FilterButtonProps {
  icon: React.ReactNode;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  bgColor?: string;
}

const FilterButton = ({ icon, active, disabled, onClick, bgColor }: FilterButtonProps) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`relative w-14 h-14 cursor-pointer flex items-center justify-center rounded-xl border-2 transition-all duration-300 font-semibold text-xs overflow-hidden group ${
      active
        ? "border-[#9a0002] bg-[#9a0002] text-white shadow-lg shadow-[#9a0002]/30"
        : disabled
          ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
          : "bg-white text-[#9a0002] border-gray-200 hover:border-[#9a0002] hover:shadow-md hover:bg-red-50"
    }`}
    style={{ fontFamily: "Roboto" }}
  >
    <div
      className={`absolute inset-0 opacity-10 ${active ? "opacity-20" : "group-hover:opacity-5"}`}
      style={{ backgroundColor: bgColor }}
    />
    <span className="relative z-10">{icon}</span>
  </button>
)


export default FilterButton;
