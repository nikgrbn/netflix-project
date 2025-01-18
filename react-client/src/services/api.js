import axios from 'axios';

const API_BASE_URL = 'http://localhost:19844/api';

// Function to sign up a user with file upload
export const signUpUser = async (userData) => {
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value); // Append all form data, including the file
    });

    const response = await axios.post(`${API_BASE_URL}/users`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Specify multipart form data
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Fetch movie details by ID
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Function to get the video URL for a movie
export const fetchMovieVideoUrl = async (movieId) => {
  try {
    // Construct the URL for video streaming
    const videoUrl = `${API_BASE_URL}/movies/${movieId}/video`;
    return videoUrl;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};