import styled from 'styled-components';

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid ${props => props.error ? '#f00' : '#6c63ff'};
  border-radius: 8px;
  font-size: 1rem;
`;

export default Input;
