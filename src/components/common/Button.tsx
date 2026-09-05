import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { backgroundColor: "#4f46e5", color: "#fff" },
  secondary: { backgroundColor: "#e5e7eb", color: "#1f2937" },
  danger: { backgroundColor: "#dc2626", color: "#fff" },
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  fullWidth = false,
  children,
  style,
  ...rest
}) => {
  return (
    <button
      style={{
        padding: "10px 18px",
        border: "none",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        width: fullWidth ? "100%" : "auto",
        ...variantStyles[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
