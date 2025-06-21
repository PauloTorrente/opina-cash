import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import ProfileFormFields from '../../components/user/ProfileFormFields';
import ChildrenFields from '../../components/user/ChildrenFields';
import Button from '../../components/common/Button/Button';
import SuccessModalUpdate from '../../components/common/Modal/SuccessModal';
import ProfileProgress from '../../components/user/ProfileProgress';
import { Container, Title } from '../../components/user/Profile.styles';
import FormValidator from '../../components/common/FormValidator';

export default function Profile() {
  const { authFetch } = useContext(AuthContext);
  const [form, setForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const fields = [
    { name: 'firstName', label: 'Nombre', type: 'text', required: true },
    { name: 'lastName', label: 'Apellido', type: 'text', required: true },
    {
      name: 'gender',
      label: 'Sexo',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Seleccione' },
        { value: 'Masculino', label: 'Masculino' },
        { value: 'Femenino', label: 'Femenino' },
        { value: 'Otro', label: 'Otro' },
        { value: 'Prefiero no decir', label: 'Prefiero no decir' },
      ],
    },
    { name: 'age', label: 'Edad', type: 'number', required: true },
    { name: 'phone_number', label: 'Teléfono', type: 'phone', required: true },
    { name: 'city', label: 'Ciudad', type: 'text', required: true },
    { name: 'residentialArea', label: 'Zona de residencia', type: 'text', required: true },
    {
      name: 'purchaseResponsibility',
      label: '¿Eres responsable de compras en el hogar?',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Seleccione' },
        { value: 'Sí', label: 'Sí' },
        { value: 'Parcialmente', label: 'Parcialmente' },
        { value: 'No', label: 'No' },
      ],
    },
    { 
      name: 'educationLevel', 
      label: 'Nivel educativo', 
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Seleccione' },
        { value: 'Primaria', label: 'Primaria' },
        { value: 'Secundaria', label: 'Secundaria' },
        { value: 'Universidad', label: 'Universidad' },
        { value: 'Posgrado', label: 'Posgrado' },
        { value: 'Otro', label: 'Otro' },
      ]
    },
    {
      name: 'children',
      label: '¿Tienes hijos?',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Seleccione' },
        { value: 'Sí', label: 'Sí' },
        { value: 'No', label: 'No' },
      ],
    },
  ];

  useEffect(() => {
    async function load() {
      try {
        const response = await authFetch('/users/me');
        const userData = response.data;

        if (userData.phone_number && typeof userData.phone_number !== 'string') {
          userData.phone_number = '';
        }

        if (typeof userData.children_ages === 'string') {
          userData.children_ages = userData.children_ages.replace(/[{}]/g, '');
        }

        setForm(userData);
        setHasChildren(userData.children_count > 0);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }
    load();
  }, [authFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (name === 'children') {
      setHasChildren(value === 'Sí');
    }

    // Clear error when field is modified
    if (invalidFields.includes(name)) {
      setInvalidFields(prev => prev.filter(field => field !== name));
    }
  };

  const handlePhoneChange = (value) => {
    setForm(prev => ({ ...prev, phone_number: value }));
    if (invalidFields.includes('phone_number')) {
      setInvalidFields(prev => prev.filter(field => field !== 'phone_number'));
    }
  };

  const handleSubmit = async () => {
    if (!formValid) {
      if (invalidFields.length > 0) {
        const firstInvalidField = document.getElementById(invalidFields[0]);
        if (firstInvalidField) {
          firstInvalidField.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          firstInvalidField.focus();
        }
      }
      return;
    }

    try {
      const payload = {
        ...form,
        phone_number: form.phone_number || null,
        children_count: hasChildren ? (form.children_count || 1) : null,
        children_ages: hasChildren 
          ? form.children_ages?.split(',').map(age => parseInt(age.trim())).filter(age => !isNaN(age))
          : null
      };

      await authFetch('/users/me', {
        method: 'PATCH',
        data: payload,
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!form) return <p style={{ textAlign: 'center' }}>Cargando perfil...</p>;

  return (
    <Container ref={formRef}>
      <Title>Completa tu perfil</Title>
      
      <FormValidator 
        form={form} 
        setFormValid={setFormValid}
        setInvalidFields={setInvalidFields}
        requiredFields={fields.filter(f => f.required).map(f => f.name)}
      />
      
      <ProfileProgress 
        fields={fields} 
        form={form} 
        invalidFields={invalidFields}
      />
      
      <ProfileFormFields
        fields={fields}
        form={form}
        invalidFields={invalidFields}
        onChange={handleChange}
        onPhoneChange={handlePhoneChange}
      />

      {hasChildren && (
        <ChildrenFields 
          form={form}
          handleChange={handleChange}
          invalidFields={invalidFields}
        />
      )}

      <Button 
        fullWidth 
        onClick={handleSubmit} 
        valid={formValid}
        aria-label={formValid ? "Guardar perfil completo" : "Complete todos los campos requeridos"}
        className={formValid ? 'pulse-animation' : ''}
      >
        Guardar
      </Button>

      {showModal && <SuccessModalUpdate onClose={() => navigate('/')} />}
    </Container>
  );
}