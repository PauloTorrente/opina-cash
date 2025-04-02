import axios from 'axios';

export const handleRegisterSubmit = async (formData, setErrors, setShowSuccessModal) => {
  try {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors(['Passwords do not match.']); // Show error if passwords don't match
      return;
    }

    // Send POST request to register the user
    const response = await axios.post('https://enova-backend.onrender.com/api/auth/register', {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: "user", // Default role is user
    });
    console.log('Successful registration:', response.data);
    setShowSuccessModal(true); // Show success modal on successful registration
  } catch (error) {
    console.error('Error during registration:', error.response ? error.response.data : error); // Log error if any
    if (error.response) {
      const { status, data } = error.response;

      // Handle different error responses based on status and message
      if (status === 409 && data.message === 'Email is already registered') {
        setErrors(['This email is already registered.']); // Show error if email is already registered
      } else if (status === 400 && data.message === 'Invalid email format') {
        setErrors(['Invalid email format.']); // Show error for invalid email format
      } else if (status === 400 && data.message === 'Password must be at least 8 characters') {
        setErrors(['Password must be at least 8 characters.']); // Show error for short password
      } else {
        setErrors([data.message || "Error connecting to the server. Please try again later."]); // Show generic error message
      }
    } else if (error.request) {
      setErrors(["Could not connect to the server. Please check your internet connection and try again."]); // Show error if no response from server
    } else {
      setErrors(["An unexpected error occurred. Please try again later."]); // Show generic unexpected error message
    }
  }
};
