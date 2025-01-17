import "./SignInPage.css";
import SignInHeader from "../components/SignIn/SignInHeader";
import SignInForm from "../components/SignIn/SignInForm";

const SignInPage = () => {
  
  return (
    <div className="signin-page">
      <SignInHeader />
      <SignInForm />
    </div>
  );
};

export default SignInPage;
