import axios from 'axios';

export const handleRegisterSubmit = async (formData, setErrors, setShowSuccessModal) => {
  try {
    // Verifica se as senhas coincidem
    if (formData.password !== formData.confirmPassword) {
      setErrors(['Las contraseñas no coinciden.']);
      return;
    }

    const response = await axios.post('https://enova-backend.onrender.com/api/auth/register', {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: "user",
    });
    console.log('Registro exitoso:', response.data);
    setShowSuccessModal(true);
  } catch (error) {
    console.error('Error en el registro:', error.response ? error.response.data : error);
    if (error.response) {
      const { status, data } = error.response;

      if (status === 409 && data.message === 'Email is already registered') {
        setErrors(['Este correo electrónico ya está registrado.']);
      } else if (status === 400 && data.message === 'Invalid email format') {
        setErrors(['Formato de correo electrónico inválido.']);
      } else if (status === 400 && data.message === 'Password must be at least 8 characters') {
        setErrors(['La contraseña debe tener al menos 8 caracteres.']);
      } else {
        setErrors([data.message || "Error al conectar con el servidor. Por favor, intenta de nuevo más tarde."]);
      }
    } else if (error.request) {
      setErrors(["No se pudo conectar al servidor. Verifica tu conexión a internet e intenta de nuevo."]);
    } else {
      setErrors(["Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde."]);
    }
  }
};
