import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const RegisterDetail = () => {
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    phoneNumber: '',
    city: '',
    residentialArea: '',
    purchaseResponsibility: false,
    childrenCount: 0,
    childrenAges: [],
    educationLevel: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://enova-backend.onrender.com/api/auth/register-detail', formData);
      console.log(response.data);
      navigate('/success');
    } catch (error) {
      console.error(error);
      setError("Error al guardar los detalles, por favor intente nuevamente.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <FormContainer>
        <FormTitle>Rellenar detalles</FormTitle>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="gender"
            placeholder="Género"
            onChange={handleChange}
          />
          <Input
            type="number"
            name="age"
            placeholder="Edad"
            onChange={handleChange}
          />
          <Input
            type="text"
            name="phoneNumber"
            placeholder="Teléfono"
            onChange={handleChange}
          />
          <Input
            type="text"
            name="city"
            placeholder="Ciudad"
            onChange={handleChange}
          />
          <Input
            type="text"
            name="residentialArea"
            placeholder="Barrio"
            onChange={handleChange}
          />
          <Input
            type="number"
            name="childrenCount"
            placeholder="Número de hijos"
            onChange={handleChange}
          />
          <Input
            type="text"
            name="childrenAges"
            placeholder="Edades de los hijos"
            onChange={handleChange}
          />
          <Input
            type="text"
            name="educationLevel"
            placeholder="Nivel educativo"
            onChange={handleChange}
          />
          <Button type="submit">Guardar detalles</Button>
        </form>
        {error && <Message>{error}</Message>}
      </FormContainer>
    </motion.div>
  );
};

export default RegisterDetail;
