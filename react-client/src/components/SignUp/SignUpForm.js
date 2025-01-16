import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import SignUpInput from './SignUpInput';
import SignUpButton from './SignUpButton';
import { signUpUser } from '../../services/api'; // Import API service

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, // Spread operator to copy the existing state
      [name]: value // Update the field that matches the name attribute
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUpUser(formData);
      navigate('/homepage'); // Redirect to the homepage after successful signup
    } catch (error) {
      setMessage(error.message || 'User already exists.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <SignUpInput
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          required={true}
        />
        <SignUpInput
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required={true}
        />
        <SignUpButton />
      </form>
      {message && <p>{message}</p>} 
    </div>
  );
};

export default SignUpForm;
