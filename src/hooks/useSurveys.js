import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export const useSurveys = () => {
  const { authFetch } = useContext(AuthContext);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await authFetch('/surveys/active');
        if (response.data && response.data.surveys && Array.isArray(response.data.surveys)) {
          setSurveys(response.data.surveys);
        } else {
          throw new Error('Resposta da API não contém um array de enquetes');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [authFetch]);

  return { surveys, loading, error };
};