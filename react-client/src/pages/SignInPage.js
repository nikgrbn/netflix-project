import "./SignInPage.css";
import SignInHeader from "../components/SignIn/SignInHeader";
import SignInForm from "../components/SignIn/SignInForm";
import ThemeToggleButton from "../components/SignIn/ThemeToggleButton";
import { useNavigate } from "react-router-dom";
import useTheme from "../components/Shared/ThemeProvider";
import { signInUser } from "../services/api";

const SignInPage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleFormSubmit = async (data) => {
    try {
      const { username, role, token } = await signInUser(
        data.username,
        data.password
      );
      console.log("User signed in successfully:", username, role, token)
      if (!username || !token) {
        throw new Error("Invalid response from server.");
      }

      alert("User signed in successfully!");
      navigate("/home", {
        state: { username, role, token },
      });
    } catch (error) {
      console.error("Error signing in:", error);
      alert(error.message);
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
