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

// Function to sign in a user
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
        "authorization": `Bearer ${token}`, // Pass the token as a Bearer token in the Authorization header
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
      "authorization": `Bearer ${token}`, // Pass the token as a Bearer token in the Authorization header
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch video stream: ${response.statusText}`);
  }

  const blob = await response.blob(); // Convert response to Blob
  return URL.createObjectURL(blob); // Create a Blob URL
};

// Fetch movie by user id
export const fetchMoviesByUserID = async (userId, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/movies`, // Use POST instead of GET
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          "User-ID": userId, // Pass the userId in the User-ID header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Function to get user profile by ID
export const getUserProfile = async (userId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


// Function to search for movies
export const fetchSearchResults = async (query, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/movies/search/${query}`, // Use POST instead of GET
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Function to fetch recommended movies
export const fetchRecommendedMovies = async (userId, movieId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/${movieId}/recommend`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        "User-ID": userId, // Pass the userId in the User-ID header
      },
    });

    // Ensure the response is an array of movies
    if (!Array.isArray(response.data)) {
      throw new Error("Invalid response format. Expected an array.");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


// Function to fetch categories
export const fetchCategories = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`,  {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const PostCategory = async (categoryData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/categories`,
      categoryData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      }
    );
    console.log("API call successful:", response.data);
    return response.data; // Return the created category
  } catch (error) {
    console.log("API call failed:", error);
    throw error.response?.data || error.message;
  }
};

export const deleteCategory = async (categoryId ,token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}`,  {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const patchCategory = async (categoryId, updatedCategory, token) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/categories/${categoryId}`,
      JSON.stringify(updatedCategory), 
      {
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    return response.data; 
  } catch (error) {
    throw error.response?.data?.error || error.message || "An unknown error occurred";
  }
};