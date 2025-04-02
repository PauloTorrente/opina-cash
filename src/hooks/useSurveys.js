import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Importing the AuthContext to access authFetch for authenticated requests

// Custom hook to fetch active surveys
export const useSurveys = () => {
  const { authFetch } = useContext(AuthContext); // Accessing the authFetch function from AuthContext for making authenticated API requests
  const [surveys, setSurveys] = useState([]); // State variable to store the surveys fetched from the API
  const [loading, setLoading] = useState(true); // State variable to indicate loading status while fetching data
  const [error, setError] = useState(null); // State variable to store any error that may occur during the fetch

  useEffect(() => {
    // Function to fetch active surveys from the API
    const fetchSurveys = async () => {
      try {
        const response = await authFetch('/surveys/active'); // Make the authenticated request to fetch active surveys

        // Check if the response contains an array of surveys
        if (response.data && response.data.surveys && Array.isArray(response.data.surveys)) {
          setSurveys(response.data.surveys); // Store the surveys in the state
        } else {
          throw new Error('API response does not contain an array of surveys'); // Throw an error if the response is not valid
        }

        setLoading(false); // Set loading to false after data is successfully fetched
      } catch (err) {
        setError(err.message); // Store the error message if an error occurs during the fetch
        setLoading(false); // Set loading to false even if an error occurs
      }
    };

    fetchSurveys(); // Call the function to fetch surveys when the component is mounted
  }, [authFetch]); // Run the effect when authFetch changes

  return { surveys, loading, error }; // Return the state variables so they can be used by the component
};
