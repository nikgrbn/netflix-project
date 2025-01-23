import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import ConsolePage from "./pages/ConsolePage";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

function AppRoutes() {
  const location = useLocation();
  const state = location.state || {};

  return (
    <>
      {/* Render the primary routes */}
      <Routes location={state.backgroundLocation || location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />

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
          <Route
            path="/console"
            element={
              <ConsolePage />
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

      {/* Render the modal for MovieInfoPage */}
      {state.backgroundLocation && (
        <Routes>
          <Route
            path="/movies/:id"
            element={
              <ProtectedRoute>
                <MovieInfoPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
}

export default App;
