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
          <Route element={<Layout />}>
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/movies/:id"
            element={
              <ProtectedRoute>
                <MovieInfoPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
