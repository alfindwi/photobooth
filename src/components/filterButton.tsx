// components/FilterButton.tsx
import React from "react";

interface FilterButtonProps {
  icon: React.ReactNode;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ icon, active, disabled, onClick }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        w-12 h-12 flex items-center justify-center rounded-full border-2 font-semibold text-xs transition duration-200
        ${
          disabled
            ? "bg-gray-300 text-white border-gray-300 cursor-not-allowed"
            : active
            ? "bg-[#D72323] text-white border-[#D72323] cursor-pointer"
            : "bg-white text-[#D72323] border-[#D72323] hover:bg-[#D72323]/10 cursor-pointer"
        }
      `}
    >
      {icon}
    </button>
  );
};

export default FilterButton;
