import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const FormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff5f8;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #9b5de5;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #d6a7e1;
  border-radius: 8px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  background-color: #f7b7a3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;

  &:hover {
    background-color: #f4a59d;
  }
`;

const Message = styled.p`
  text-align: center;
  color: #9b5de5;
  font-size: 1rem;
  margin-top: 1rem;
`;

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://enova-backend.onrender.com/api/auth/login', credentials);
      console.log(response.data);
      alert("¡Login exitoso!");
      // Salvar token, redirecionar ou realizar outras ações
    } catch (error) {
      console.error(error);
      setError("Error al iniciar sesión, verifique sus credenciales.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <FormContainer>
        <FormTitle>Iniciar sesión</FormTitle>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />
          <Button type="submit">Entrar</Button>
        </form>
        {error && <Message>{error}</Message>}
      </FormContainer>
    </motion.div>
  );
};
// update
export default Login;
