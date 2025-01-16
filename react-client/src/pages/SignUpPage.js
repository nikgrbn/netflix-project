import React from 'react';
import SignUpForm from '../components/SignUp/SignUpForm';
import Header from '../components/Shared/Header';

const SignUpPage = () => {
  return (
    <div>
      <Header />
      <h1>Sign Up</h1>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;