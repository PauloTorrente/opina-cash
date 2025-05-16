import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ProfileFormFields from '../components/ProfileFormFields';
import ChildrenFields from '../components/ChildrenFields';
import Button from '../components/Button';
import SuccessModalUpdate from '../components/SuccessModalUpdate';
import ProfileProgress from '../components/ProfileProgress';
import { Container, Title } from '../components/Profile.styles';
import FormValidator from '../components/FormValidator'; 

export default function Profile() {
  const { authFetch } = useContext(AuthContext);
  const [form, setForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [formValid, setFormValid] = useState(false); 
  const [formErrors, setFormErrors] = useState({});  
  const navigate = useNavigate();
  const formRef = useRef(null);

  const fields = [
    { name: 'firstName', label: 'Nombre', type: 'text' },
    { name: 'lastName', label: 'Apellido', type: 'text' },
    {
      name: 'gender',
      label: 'Sexo',
      type: 'select',
      options: [
        { value: '', label: 'Seleccione' },
        { value: 'Masculino', label: 'Masculino' },
        { value: 'Femenino', label: 'Femenino' },
        { value: 'Otro', label: 'Otro' },
        { value: 'Prefiero no decir', label: 'Prefiero no decir' },
      ],
    },
    { name: 'age', label: 'Edad', type: 'text' },
    { name: 'phone_number', label: 'Teléfono', type: 'phone' },
    { name: 'city', label: 'Ciudad', type: 'text' },
    { name: 'residentialArea', label: 'Zona de residencia', type: 'text' },
    {
      name: 'purchaseResponsibility',
      label: '¿Eres responsable de compras en el hogar?',
      type: 'select',
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
      options: [
        { value: '', label: 'Seleccione' },
        { value: 'Primaria', label: 'Primaria' },
        { value: 'Secundaria', label: 'Secundaria' },
        { value: 'Universidad', label: 'Universidad' },
        { value: 'Posgrado', label: 'Posgrado' },
        { value: 'Otro', label: 'Otro' },
      ],
    },
    {
      name: 'children',
      label: '¿Tienes hijos?',
      type: 'select',
      options: [
        { value: '', label: 'Seleccione' },
        { value: 'Sí', label: 'Sí' },
        { value: 'No', label: 'No' },
      ],
    },
  ];

  // Campos obrigatórios para validação
  const requiredFields = [
    'firstName',
    'lastName',
    'gender',
    'age',
    'phone_number',
    'city',
    'residentialArea',
    'purchaseResponsibility',
    'educationLevel',
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
        console.error("Error al cargar el perfil:", error);
      }
    }
    load();
  }, [authFetch]);

  if (!form) return <p style={{ textAlign: 'center' }}>Cargando perfil...</p>;

  // Função que valida o formulário e seta quais campos tem erro
  const validateForm = () => {
    const errors = {};
    requiredFields.forEach((field) => {
      if (!form[field] || String(form[field]).trim() === '') {
        errors[field] = true;
      }
    });

    // Se tiver filhos, validar campo(s) relacionados aqui, se necessário
    if (hasChildren) {
      // por exemplo, validar children_count
      if (!form.children_count || isNaN(Number(form.children_count)) || Number(form.children_count) < 1) {
        errors.children_count = true;
      }
      // validar children_ages como string com números separados por vírgula, mínimo 1 idade?
      if (!form.children_ages || form.children_ages.trim() === '') {
        errors.children_ages = true;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Ao clicar em salvar, valida e faz scroll no primeiro erro
  const handleSubmit = async () => {
    if (!validateForm()) {
      // Scroll para o primeiro erro
      const firstErrorField = Object.keys(formErrors)[0];
      if (firstErrorField) {
        const el = document.querySelector(`[name="${firstErrorField}"]`);
        if (el && el.scrollIntoView) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
      }
      alert('Por favor, completa todos los campos obligatorios antes de guardar.');
      return;
    }

    try {
      const payload = {
        ...form,
        phone_number: form.phone_number || null,
        children_count: form.children_count ? parseInt(form.children_count) : null,
        children_ages: form.children_ages
          ? form.children_ages
              .split(',')
              .map((age) => parseInt(age.trim()))
              .filter((age) => !isNaN(age))
          : null,
      };

      await authFetch('/users/me', {
        method: 'PATCH',
        data: payload,
      });

      setShowModal(true);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  // Atualiza form e limpa erro ao digitar
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'children' && value === 'Sí') {
      setHasChildren(true);
    } else if (name === 'children' && value === 'No') {
      setHasChildren(false);
    }

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handlePhoneChange = (value) => {
    setForm((prev) => ({ ...prev, phone_number: value }));
    if (formErrors.phone_number) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy.phone_number;
        return copy;
      });
    }
  };

  return (
    <Container ref={formRef}>
      <Title>Completa tu perfil</Title>
      <FormValidator form={form} setFormValid={setFormValid} />
      <ProfileProgress fields={fields} form={form} />
      <ProfileFormFields
        fields={fields}
        form={form}
        onChange={handleChange}
        onPhoneChange={handlePhoneChange}
        errors={formErrors}  
      />

      {hasChildren && (
        <ChildrenFields
          form={form}
          handleChange={handleChange}
          errors={formErrors} 
        />
      )}

      <Button
        fullWidth
        onClick={handleSubmit}
        disabled={!formValid}
        style={{
          backgroundColor: formValid ? '#2563eb' : '#94a3b8', 
          cursor: formValid ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.3s ease',
        }}
      >
        Guardar
      </Button>

      {showModal && <SuccessModalUpdate onClose={() => navigate('/')} />}
    </Container>
  );
}
