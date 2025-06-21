import React from 'react';
import { Link } from 'react-router-dom';
import SurveyCard from '../../components/common/Card/SurveyCard';
import styled from 'styled-components';

const ListContainer = styled.div`
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ResultsList = ({ surveys }) => {
  return (
    <ListContainer>
      <Title>Available Surveys</Title>
      <Grid>
        {surveys.map((survey) => (
          <Link key={survey.id} to={`/results/${survey.id}`}>
            <SurveyCard survey={survey} />
          </Link>
        ))}
      </Grid>
    </ListContainer>
  );
};

export default ResultsList;