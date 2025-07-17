import { IoCameraOutline } from "react-icons/io5";

interface ButtonProps {
  title: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}

export default function Button({
  title,
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{ fontFamily: "Roboto" }}
      className={className}
      
    >
      <IoCameraOutline size={20} />
      {title}
    </button>
  );
}


