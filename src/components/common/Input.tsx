import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, id, ...rest }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          htmlFor={id}
          style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: `1px solid ${error ? "#dc2626" : "#e5e7eb"}`,
          borderRadius: 8,
          fontSize: 14,
        }}
        {...rest}
      />
      {error && (
        <span style={{ color: "#dc2626", fontSize: 12 }}>{error}</span>
      )}
    </div>
  );
};

export default Input;
