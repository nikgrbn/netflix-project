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

export const signInUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/`, userData);
    return response.data;
  } catch (error) {
    // Return the error message
    throw error.response?.data || error.message;
  }
};

