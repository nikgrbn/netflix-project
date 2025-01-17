import React from "react";

const SignUpInput = ({ type, placeholder, value, onChange, onFocus, onBlur, hasError }) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className={hasError ? "error" : ""}
      />
    </div>
  );
};

export default SignUpInput;