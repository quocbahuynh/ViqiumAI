import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md" |"icon"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void; // Click handler, hỗ trợ cả có và không có event
  disabled?: boolean; // Disabled state
  className?: string; // Additional classes
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-[30px] py-[10px] text-sm",
    md: "px-[25px] py-[11px] text-sm",
    icon:""
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-black text-white shadow-theme-xs hover:bg-[#b1e346]  disabled:bg-gray-400",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
  };

  // Xử lý sự kiện onClick
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return; // Không gọi onClick nếu button bị disabled
    onClick?.(e); // Gọi onClick với tham số event
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-normal gap-2 rounded-md transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={handleClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;