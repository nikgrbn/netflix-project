import axios from 'axios';

const API_BASE_URL = 'http://localhost:19844/api';

// Function to sign up a user
export const signUpUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    return response.data;
  } catch (error) {
    // Return the error message
    throw error.response?.data || error.message;
  }
};
