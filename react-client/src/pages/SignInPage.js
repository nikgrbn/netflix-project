import "./SignInPage.css";
import SignInHeader from "../components/SignIn/SignInHeader";
import SignInForm from "../components/SignIn/SignInForm";
import ThemeToggleButton from "../components/SignIn/ThemeToggleButton"; 
import SignUpButton from "../components/SignUp/SignUpButton";
import { useNavigate } from "react-router-dom";
import useTheme from "../components/Shared/ThemeProvider";
import { signInUser } from "../services/api";

const SignInPage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleFormSubmit =  async (data) => {
    try {
      await signInUser(data);
      alert("User signed in successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="signin-page">
      <SignInHeader />
      <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
      <div className="signin-content">
        <SignInForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default SignInPage;
