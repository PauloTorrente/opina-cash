import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Importing the AuthContext to access authFetch for authenticated requests

// Custom hook to fetch survey responses based on the survey ID
export const useResponses = (surveyId) => {
  const { authFetch } = useContext(AuthContext); // Accessing the authFetch function from AuthContext for authenticated API requests
  const [responses, setResponses] = useState([]); // State variable to store the responses fetched from the API
  const [loading, setLoading] = useState(true); // State variable to indicate loading status while fetching data
  const [error, setError] = useState(null); // State variable to store any error that may occur during the fetch

  useEffect(() => {
    if (!surveyId) return; // If there is no surveyId, stop further execution

    // Function to fetch survey responses from the API
    const fetchResponses = async () => {
      try {
        const response = await authFetch(`/results/survey/${surveyId}`); // Make the authenticated request to fetch survey responses

        // Check if the response contains an array of responses
        if (response.data && Array.isArray(response.data.responses)) {
          setResponses(response.data.responses); // Store the responses in the state
        } else {
          throw new Error('API response does not contain an array of responses'); // Throw an error if the response is not valid
        }

        setLoading(false); // Set loading to false after data is successfully fetched
      } catch (err) {
        setError(err.message); // Store the error message if an error occurs during the fetch
        setLoading(false); // Set loading to false even if an error occurs
      }
    };

    fetchResponses(); // Call the function to fetch responses when the component is mounted or surveyId changes
  }, [surveyId, authFetch]); // Run the effect when surveyId or authFetch changes

  return { responses, loading, error }; // Return the state variables so they can be used by the component
};
