import styled from 'styled-components';

const InputField = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 13px 16px;
  margin: 0;
  border: 1.5px solid ${({ $error }) => $error ? '#EF4444' : '#D1D5DB'};
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.5;
  background: #F9FAFB;
  color: #111827;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  -webkit-appearance: none;
  appearance: none;
  display: block;

  &:focus {
    outline: none;
    border-color: #6c63ff;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.15);
    background: #fff;
  }

  &::placeholder {
    color: #9CA3AF;
  }

  /* Evitar zoom no iOS */
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

export default InputField;
