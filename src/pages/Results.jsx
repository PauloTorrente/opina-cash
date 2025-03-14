import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ResultsList from './ResultsList';
import ResultsDetails from './ResultsDetails';
import Filters from '../components/Filters';
import { SkeletonLoader } from '../components/SkeletonCard';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Results = () => {
  const { surveyId } = useParams(); // Pega o ID da enquete da URL
  const [filter, setFilter] = useState('all');
  const [surveys, setSurveys] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca as enquetes ativas
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('https://enova-backend.onrender.com/api/surveys/active');
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

    fetchSurveys();
  }, []);

  // Busca as respostas da enquete específica
  useEffect(() => {
    if (surveyId) {
      const fetchResponses = async () => {
        try {
          const token = localStorage.getItem('token'); // Recupera o token do localStorage
          if (!token) {
            throw new Error('Token de autenticação não encontrado.');
          }

          const response = await fetch(`https://enova-backend.onrender.com/api/results/survey/${surveyId}`, {
            headers: {
              'Authorization': `Bearer ${token}`, // Adiciona o token no header
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
  }, [surveyId]);

  // Filtra e ordena as enquetes
  const filteredSurveys = surveys.filter((survey) => {
    if (filter === 'active') return survey.status === 'active';
    if (filter === 'expired') return survey.status === 'expired';
    return true; // Todas
  });

  const sortedSurveys = filteredSurveys.sort((a, b) => {
    return new Date(a.expirationTime) - new Date(b.expirationTime);
  });

  if (loading) return <SkeletonLoader />;
  if (error) return <p>Erro: {error}</p>;

  return (
    <Container>
      {!surveyId ? ( // Se não houver surveyId, mostra a lista de enquetes
        <>
          <Filters onFilterChange={setFilter} />
          <ResultsList surveys={sortedSurveys} />
        </>
      ) : ( // Se houver surveyId, mostra os detalhes da enquete
        <ResultsDetails
          responses={responses}
          survey={surveys.find((s) => s.id === parseInt(surveyId))}
        />
      )}
    </Container>
  );
};

export default Results;