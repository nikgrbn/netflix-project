import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import MovieInfoPage from "./pages/MovieInfoPage";
import SearchPage from "./pages/SearchPage";
import "./styles/themes.css";
import { ThemeProvider } from "./components/Shared/ThemeProvider";
import ProtectedRoute from "./components/Shared/ProtectedRoute";
import Layout from "./components/Shared/MainHeader/Layout";
import VideoPage from "./pages/VideoPage";
import CategoriesPage from "./pages/CategoriesPage";

function App() {
  const username = localStorage.getItem("display_name");
  const profilePicture = localStorage.getItem("profile_picture");

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />

          {/* Nested routes for Layout */}
          <Route element={<ProtectedRoute> <Layout /> </ProtectedRoute>}>
            <Route
              path="/home"
              element={
                  <HomePage />
              }
            />
            <Route
              path="/search"
              element={
                  <SearchPage />
              }
            />
            <Route
              path="/categories"
              element={
                  <CategoriesPage />
              }
            />

            {/* Route for Movie Modal */}
            <Route
              path="/movies/:id"
              element={
                  <>
                    <HomePage /> {/* Background page */}
                    <MovieInfoPage /> {/* Modal */}
                  </>
              }
            />
          </Route>

          <Route
            path="/watch/:id"
            element={
              <ProtectedRoute>
                <VideoPage />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;