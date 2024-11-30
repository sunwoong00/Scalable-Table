import React from 'react';

const Cell = React.memo(({ value, onChange }) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          textAlign: "center",
          backgroundColor: "transparent",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
});

export default Cell;
