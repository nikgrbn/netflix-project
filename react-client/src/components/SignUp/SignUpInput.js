import React from 'react';


const SignUpInput = ({ name, label, type = 'text', value, onChange, required }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default SignUpInput;