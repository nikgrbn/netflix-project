import React from "react";

const SignUpInput = ({ type, placeholder, value, onChange }) => {
  return (
    <div className="form-group">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
};

export default SignUpInput;
