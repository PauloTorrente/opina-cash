import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ResultsList from './ResultsList';
import ResultsDetails from './ResultsDetails';
import Filters from '../../components/results/Filters';
import { SkeletonLoader } from '../../components/common/Card/SkeletonCard';
import styled from 'styled-components';
import AuthContext from '../../context/AuthContext';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Results = () => {
  const { surveyId } = useParams();
  const [filter, setFilter] = useState('all');
  const [surveys, setSurveys] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Verifica se o usuário é admin
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Busca as enquetes ativas
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de autenticação não encontrado.');
        }

        const response = await fetch('https://enova-backend.onrender.com/api/surveys/active', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        const data = await response.json();
        setSurveys(data.surveys);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'Admin') {
      fetchSurveys();
    }
  }, [user]);

  // Busca as respostas da enquete específica
  useEffect(() => {
    if (surveyId && user?.role === 'Admin') {
      const fetchResponses = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Token de autenticação não encontrado.');
          }

          const response = await fetch(`https://enova-backend.onrender.com/api/results/survey/${surveyId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
          }

          const data = await response.json();
          setResponses(data.responses);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchResponses();
    }
  }, [surveyId, user]);

  // Filtra e ordena as enquetes
  const filteredSurveys = surveys.filter((survey) => {
    if (filter === 'active') return survey.status === 'active';
    if (filter === 'expired') return survey.status === 'expired';
    return true;
  });

  const sortedSurveys = filteredSurveys.sort((a, b) => {
    return new Date(a.expirationTime) - new Date(b.expirationTime);
  });

  if (loading) return <SkeletonLoader />;
  if (error) return <p>Erro: {error}</p>;

  return (
    <Container>
      {!surveyId ? (
        <>
          <Filters onFilterChange={setFilter} />
          <ResultsList surveys={sortedSurveys} />
        </>
      ) : (
        <ResultsDetails
          responses={responses}
          survey={surveys.find((s) => s.id === parseInt(surveyId))}
        />
      )}
    </Container>
  );
};

export default Results;