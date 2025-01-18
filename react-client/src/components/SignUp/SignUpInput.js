import React from "react";

const SignUpInput = ({ type, placeholder, value, onChange, hasError, ...props }) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={hasError ? "has-error" : ""}
        {...props}
      />
    </div>
  );
};

export default SignUpInput;