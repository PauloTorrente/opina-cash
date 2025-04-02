import styled from 'styled-components';
import { motion } from 'framer-motion';

const Copyright = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const Footer = () => {
  return (

      <Copyright>
        &copy; {new Date().getFullYear()} Opina Cash - Todos los derechos reservados
      </Copyright>
  );
};

export default Footer;