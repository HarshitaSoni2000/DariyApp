import React from "react";

const Loader: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: "4px solid #e5e7eb",
          borderTopColor: "#4f46e5",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>
        {`@keyframes spin { to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
};

export default Loader;
