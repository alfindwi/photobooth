import React from "react";

interface FilterButtonProps {
  icon: React.ReactNode;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  bgColor?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  icon,
  active,
  disabled,
  onClick,
  bgColor,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        w-12 h-12 flex items-center justify-center rounded-full border-2 font-semibold text-xs transition duration-200
        ${disabled
          ? "text-white border-gray-300 cursor-not-allowed"
          : active
          ? "text-white border-[#D72323] cursor-pointer"
          : "text-black border-gray-300 hover:bg-[#D72323]/10 cursor-pointer"
        }
      `}
      style={{
        backgroundColor: disabled
          ? "#ccc"
          : active
          ? "#D72323"
          : bgColor || "white", 
      }}
    >
      {icon}
    </button>
  );
};


export default FilterButton;
