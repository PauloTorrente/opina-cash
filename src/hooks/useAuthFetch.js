import React from 'react';
import ResponseCard from '../components/ResponseCard';
import ResponseChart from '../components/ResponseChart';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuthFetch } from '../hooks/useAuthFetch'; // Adicionado para usar authFetch

const DetailsContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background: #6c63ff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 2rem;

  &:hover {
    background: #5a52e0;
  }
`;

const ResultsDetails = ({ responses, survey }) => {
  const authFetch = useAuthFetch();

  // Função para processar os dados do gráfico
  const processChartData = (responses) => {
    const chartData = {};

    responses.forEach((response) => {
      const { question, answer } = response;

      if (!chartData[question]) {
        chartData[question] = {};
      }

      if (!chartData[question][answer]) {
        chartData[question][answer] = 0;
      }

      chartData[question][answer] += 1;
    });

    // Converte o objeto em um array para o gráfico
    return Object.keys(chartData).map((question) => ({
      question,
      answers: Object.keys(chartData[question]).map((answer) => ({
        answer,
        count: chartData[question][answer],
      })),
    }));
  };

  const chartData = processChartData(responses);

  // Função para exportar as respostas para Excel
  const handleExport = async () => {
    try {
      const response = await authFetch(`/results/export/${survey.id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `responses_${survey.id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting responses:', err);
    }
  };

  return (
    <DetailsContainer>
      <Title>Survey Results</Title>
      <Button onClick={handleExport}>Export to Excel</Button>
      {chartData.map((data) => (
        <div key={data.question}>
          <h2>{data.question}</h2>
          <ResponseChart data={data.answers} />
        </div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {responses.map((response) => (
          <ResponseCard key={response.id} response={response} />
        ))}
      </motion.div>
    </DetailsContainer>
  );
};

export default ResultsDetails;