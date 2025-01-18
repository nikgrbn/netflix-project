import "./SignInPage.css";
import SignInHeader from "../components/SignIn/SignInHeader";
import SignInForm from "../components/SignIn/SignInForm";
import ThemeToggleButton from "../components/SignIn/ThemeToggleButton";
import { useNavigate } from "react-router-dom";
import useTheme from "../components/Shared/ThemeProvider";
import { signInUser } from "../services/api";
import { useEffect } from "react";

const SignInPage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleFormSubmit = async (data) => {
    try {
      const { id, username, picture, display_name, is_admin, watched_movies, token } =
        await signInUser(data.username, data.password);
      console.log("User signed in successfully:", username, is_admin, token);
      if (!username || !token) {
        throw new Error("Invalid response from server.");
      }
      
      // Store token and user details in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("id", id);
      localStorage.setItem("username", username);
      localStorage.setItem("picture", picture);
      localStorage.setItem("display_name", display_name);
      localStorage.setItem("is_admin", is_admin);
      localStorage.setItem("watched_movies", watched_movies);

      alert("User signed in successfully!");
      navigate("/home");
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
