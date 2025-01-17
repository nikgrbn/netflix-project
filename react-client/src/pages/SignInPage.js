import "./SignInPage.css";
import SignInHeader from "../components/SignIn/SignInHeader";
import SignInForm from "../components/SignIn/SignInForm";
import useTheme from "../components/Shared/ThemeProvider";
import { useNavigate, useLocation } from "react-router-dom";

const SignInPage = () => {
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <div className="signin-page">
      <SignInHeader />

      <button onClick={toggleTheme} className="theme-toggle-button">
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>

      <div className="signin-content">
        <SignInForm />
        <div>
          <p>New to Netflix? </p>
          <button
            className="signin-secondary-button"
            onClick={handleSignUpClick}
          >
            Sign up now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
