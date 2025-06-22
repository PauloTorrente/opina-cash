import React from 'react';
import styled from 'styled-components';
import ResponseChart from "../../components/results/ResponseChart";
import CommentSection from '../../components/results/CommentSection';
import StatisticsSection from '../../components/results/StatisticsSection';
import { processChartData } from '../../utils/processChartData';

const DetailsContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ExportButton = styled.button`
  background-color: #6c63ff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #5a52e0;
  }
`;

const MainContent = styled.div`
  display: flex;
  gap: 2rem;
`;

const ChartsSection = styled.div`
  flex: 2;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const RightColumn = styled.div`
  flex: 1;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ResultsDetails = ({ responses, survey }) => {
  if (!survey) return <p>Enquete não encontrada.</p>;

  // Processa as respostas para gráficos e comentários
  const processedResponses = responses.map(response => ({
    ...response,
    answer: response.answer.replace(/^"(.*)"$/, '$1'), // Remove as aspas extras
  }));

  const chartData = processChartData(processedResponses);
  const comments = processedResponses.filter(response => {
    const question = survey.questions.find(q => q.question === response.question);
    return question?.type === 'text';
  });

  // Função para exportar as respostas para Excel
  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token de autenticação não encontrado.');

      const response = await fetch(`https://enova-backend.onrender.com/api/results/export/${survey.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `responses_${survey.id}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Erro ao exportar respostas:', response.statusText);
        alert('Erro ao exportar respostas. Verifique o console para mais detalhes.');
      }
    } catch (error) {
      console.error('Erro ao exportar respostas:', error);
      alert('Erro ao exportar respostas. Verifique o console para mais detalhes.');
    }
  };

  return (
    <DetailsContainer>
      <Title>
        {survey.title}
        <ExportButton onClick={handleExport}>Exportar para Excel</ExportButton>
      </Title>
      <p>{survey.description}</p>

      {/* Layout de duas colunas */}
      <MainContent>
        {/* Gráficos à esquerda */}
        <ChartsSection>
          {chartData.map((data) => (
            <div key={data.question}>
              <h2>{data.question}</h2>
              <ResponseChart data={data.answers} />
            </div>
          ))}
        </ChartsSection>

        {/* Coluna à direita (estatísticas em cima e comentários embaixo) */}
        <RightColumn>
          <StatisticsSection responses={processedResponses} />
          {comments.length > 0 && <CommentSection comments={comments} />}
        </RightColumn>
      </MainContent>
    </DetailsContainer>
  );
};

export default ResultsDetails;