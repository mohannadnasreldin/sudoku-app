// src/components/Cell.js
import React from "react";

const Cell = ({ value, onChange, editable, isInvalid }) => {
  return (
    <div className={`w-10 h-10 border flex items-center justify-center text-lg ${isInvalid ? 'bg-red-200' : 'bg-gray-200'}`}>
      {editable ? (
        <input
          type="text"
          maxLength="1"
          className="w-full h-full text-center bg-transparent focus:outline-none"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => {
            const charCode = e.key.charCodeAt(0);
            if (charCode < 49 || charCode > 57) {
              e.preventDefault();
            }
          }}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
};

export default Cell;
