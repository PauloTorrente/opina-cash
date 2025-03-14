import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export const useResponses = (surveyId) => {
  const { authFetch } = useContext(AuthContext);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!surveyId) return;

    const fetchResponses = async () => {
      try {
        const response = await authFetch(`/results/survey/${surveyId}`);
        if (response.data && Array.isArray(response.data.responses)) {
          setResponses(response.data.responses);
        } else {
          throw new Error('Resposta da API não contém um array de respostas');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchResponses();
  }, [surveyId, authFetch]);

  return { responses, loading, error };
};