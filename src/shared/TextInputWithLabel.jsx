import React, { forwardRef } from "react";

const TextInputWithLabel = forwardRef(
  ({ elementId, label, value, onChange }, ref) => {
    return (
      <div>
        <label htmlFor={elementId}>{label}</label>
        <input
          type="text"
          id={elementId}
          value={value}
          onChange={onChange}
          ref={ref}
        />
      </div>
    );
  }
);

TextInputWithLabel.displayName = "TextInputWithLabel";

export default TextInputWithLabel;
