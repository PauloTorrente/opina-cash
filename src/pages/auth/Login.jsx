import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser } from '../../services/api.js';
import InputField from '../../components/common/Input/InputField';
import AuthContext from '../../context/AuthContext';
import styled, { keyframes } from 'styled-components';

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Styled components ────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f0ff 0%, #fff5fb 100%);
  padding: 24px 16px;
  box-sizing: border-box;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 20px;
  padding: 40px 32px;
  box-shadow: 0 12px 48px rgba(108, 99, 255, 0.12), 0 2px 8px rgba(0,0,0,0.06);
  animation: ${fadeUp} 0.4s ease-out both;

  @media (max-width: 480px) {
    padding: 32px 24px;
    border-radius: 16px;
  }
`;

const IconWrap = styled.div`
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #6c63ff, #8a84ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 6px 20px rgba(108, 99, 255, 0.3);
`;

const Heading = styled.h2`
  text-align: center;
  color: #1a1a2e;
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 28px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 8px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
`;

const ForgotLink = styled.div`
  text-align: right;
  margin: 4px 0 20px;

  a {
    color: #6c63ff;
    font-size: 0.85rem;
    font-weight: 500;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #6c63ff 0%, #8a84ff 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(108, 99, 255, 0.3);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:hover   { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(108, 99, 255, 0.4); }
  &:active  { transform: translateY(0); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const ErrorBox = styled.div`
  margin-top: 16px;
  padding: 12px 16px;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 10px;
  color: #DC2626;
  font-size: 0.88rem;
  text-align: center;
  line-height: 1.5;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #F3F4F6;
  font-size: 0.9rem;
  color: #6B7280;

  a {
    color: #6c63ff;
    font-weight: 600;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

// ─── Componente ───────────────────────────────────────────────────────────────
const Login = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { login } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);

  const from         = location.state?.from?.pathname || '/';
  const searchParams = location.state?.from?.search   || '';

  const handleChange = (field) => (e) =>
    setCredentials(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      await login(data);
      navigate(`${from}${searchParams}`, { replace: true });
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('incorrect') || msg.includes('incorrect')) {
        setError('El correo electrónico o la contraseña son incorrectos.');
      } else if (msg.includes('confirm')) {
        setError('Por favor, confirma tu correo electrónico antes de iniciar sesión.');
      } else {
        setError('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <IconWrap>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M20 21V19C20 16.79 18.21 15 16 15H8C5.79 15 4 16.79 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </IconWrap>

        <Heading>Iniciar sesión</Heading>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Label>
              Correo electrónico
              <InputField
                type="email"
                name="email"
                placeholder="tu@correo.com"
                value={credentials.email}
                onChange={handleChange('email')}
                required
                autoComplete="email"
              />
            </Label>

            <Label>
              Contraseña
              <InputField
                type="password"
                name="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange('password')}
                required
                autoComplete="current-password"
              />
            </Label>
          </FieldGroup>

          <ForgotLink>
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </ForgotLink>

          <SubmitBtn type="submit" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </SubmitBtn>
        </form>

        {error && <ErrorBox>{error}</ErrorBox>}

        <Footer>
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </Footer>
      </Card>
    </Page>
  );
};

export default Login;
