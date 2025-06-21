import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  max-width: 500px;
  margin: 3rem auto;
  background: #ffffff;
  padding: 2rem;
  border-radius: 20px;
  color: #1e293b;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #1e293b;
`;

export const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 0.3rem;
  color: #0f172a;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #0f172a;
  font-size: 1rem;
`;

export const FieldContainer = styled.div`
  margin-bottom: 1.25rem;
`;

export const ProgressBar = styled(motion.div)`
  height: 12px;
  background: #3b82f6;
  border-radius: 50px;
`;

export const ProgressWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #e2e8f0;
  padding: 0.5rem;
  z-index: 1000;
`;

export const Message = styled.p`
  color: #64748b;
  text-align: center;
  margin-top: -1rem;
  margin-bottom: 1.5rem;
`;
