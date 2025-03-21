import styled from 'styled-components';

const ButtonStyled = styled.button`
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  background-color: #6c63ff;
  color: white;
  font-size: 1.2rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Button = ({ fullWidth, ...props }) => {
  return <ButtonStyled $fullWidth={fullWidth} {...props} />;
};

export default Button;
