import axios from "axios";

const API_BASE_URL = "http://localhost:19844/api";

// Function to sign up a user with file upload
export const signUpUser = async (userData) => {
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value); // Append all form data, including the file
    });

    const response = await axios.post(`${API_BASE_URL}/users`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Specify multipart form data
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const signInUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tokens`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
   
    const serverError = error.response?.data?.error || error.message;
    throw new Error(serverError);
  }
};

// Fetch movie details by ID
export const fetchMovieDetails = async (movieId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/${movieId}`, {
      headers: {
        'User-ID': token, // Pass the token in the User-ID header
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Function to get the video URL for a movie
export const fetchMovieVideoStream = async (movieId, token) => {
  const videoUrl = `${API_BASE_URL}/movies/${movieId}/video`;
  const response = await fetch(videoUrl, {
    method: "GET",
    headers: {
      "User-ID": token, // Include the required header
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch video stream: ${response.statusText}`);
  }

  const blob = await response.blob(); // Convert response to Blob
  return URL.createObjectURL(blob); // Create a Blob URL
};
