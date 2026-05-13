import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import styled, { keyframes, css } from 'styled-components';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg:       '#F5F3EE',
  card:     '#FFFFFF',
  brand:    '#2A9D8F',
  brandDk:  '#1F7A6D',
  accent:   '#E76F51',
  text:     '#1A1A2E',
  textMid:  '#3D3D5C',
  muted:    '#8A8AA0',
  border:   '#E2DDD6',
  error:    '#E63946',
  success:  '#2A9D8F',
  inputBg:  '#FAF9F6',
};

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.88); }
  65%  { transform: scale(1.04); }
  100% { opacity: 1; transform: scale(1); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;
const shimmer = keyframes`
  0%   { background-position: -300% 0; }
  100% { background-position:  300% 0; }
`;
const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 ${C.brand}40; }
  50%       { box-shadow: 0 0 0 8px ${C.brand}00; }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: ${C.bg};
  padding-bottom: 100px;
`;

const Hero = styled.div`
  background: linear-gradient(150deg, #2A9D8F 0%, #21867A 55%, #1A6B5F 100%);
  padding: 48px 20px 64px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0; right: 0;
    height: 32px;
    background: ${C.bg};
    border-radius: 32px 32px 0 0;
  }
  &::before {
    content: '';
    position: absolute;
    top: -60px; right: -40px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }
`;

const AvatarWrap = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 3px solid rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  backdrop-filter: blur(4px);
`;

const HeroName = styled.h1`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
`;

const HeroSub = styled.p`
  color: rgba(255,255,255,0.75);
  font-size: 0.88rem;
  text-align: center;
  margin: 0;
`;

// ─── Progress pill ────────────────────────────────────────────────────────────
const ProgressPillWrap = styled.div`
  padding: 0 16px;
  margin-top: -20px;
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
  animation: ${fadeUp} 0.4s ease-out 0.1s both;
`;

const ProgressCard = styled.div`
  background: ${C.card};
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 4px 20px rgba(42,157,143,0.12), 0 1px 4px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ProgressTrack = styled.div`
  flex: 1;
  height: 8px;
  background: #EBE8E2;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $pct }) =>
    $pct === 100
      ? `linear-gradient(90deg, ${C.brand}, #34D399)`
      : `linear-gradient(90deg, ${C.brand}, #52C7BB)`};
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 300% 100%;
    animation: ${shimmer} 2s infinite;
    display: ${({ $pct }) => $pct > 0 && $pct < 100 ? 'block' : 'none'};
  }
`;

const ProgressPct = styled.span`
  font-size: 0.88rem;
  font-weight: 800;
  color: ${({ $done }) => $done ? C.brand : C.muted};
  min-width: 38px;
  text-align: right;
`;

const ProgressMsg = styled.span`
  font-size: 0.78rem;
  color: ${C.muted};
  font-weight: 500;
`;

// ─── Form area ────────────────────────────────────────────────────────────────
const FormArea = styled.div`
  padding: 8px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  animation: ${fadeUp} 0.4s ease-out 0.15s both;
`;

const SectionTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${C.muted};
  padding: 20px 4px 8px;
`;

const FieldCard = styled.div`
  background: ${C.card};
  border-radius: 14px;
  margin-bottom: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04);
  border: 1.5px solid ${({ $error }) => $error ? C.error + '60' : 'transparent'};
  transition: border-color 0.2s;
`;

const FieldInner = styled.div`
  padding: 14px 16px 12px;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ $error }) => $error ? C.error : C.muted};
  margin-bottom: 6px;
  transition: color 0.2s;
`;

const FieldInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-family: inherit;
  color: ${C.text};
  padding: 0;
  outline: none;
  -webkit-appearance: none;
  appearance: none;

  &::placeholder { color: #BDB8B0; }
  &[type="number"] { -moz-appearance: textfield; }
  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }

  /* iOS no-zoom */
  @media (max-width: 480px) { font-size: 16px; }
`;

const FieldSelect = styled.select`
  width: 100%;
  box-sizing: border-box;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-family: inherit;
  color: ${({ value }) => !value ? '#BDB8B0' : C.text};
  padding: 0;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;

  option { color: ${C.text}; }
  option[value=""] { color: #BDB8B0; }

  @media (max-width: 480px) { font-size: 16px; }
`;

const SelectArrow = styled.div`
  position: relative;
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0; height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid ${C.muted};
    pointer-events: none;
  }
`;

const FieldError = styled.div`
  font-size: 0.72rem;
  color: ${C.error};
  padding: 4px 16px 10px;
  font-weight: 500;
`;

const FieldDivider = styled.div`
  height: 1px;
  background: ${C.border};
  margin: 0 16px;
`;

// Phone input override
const PhoneWrap = styled.div`
  .PhoneInput {
    display: flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    border: none;
  }
  .PhoneInputCountry { display: flex; align-items: center; }
  .PhoneInputCountryIcon { width: 20px; height: 14px; border-radius: 2px; }
  .PhoneInputCountrySelectArrow { display: none; }
  .PhoneInputCountrySelect {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  .PhoneInputInput {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 1rem;
    font-family: inherit;
    color: ${C.text};
    outline: none;
    &::placeholder { color: #BDB8B0; }
    @media (max-width: 480px) { font-size: 16px; }
  }
`;

// ─── Submit button ────────────────────────────────────────────────────────────
const SubmitWrap = styled.div`
  padding: 0 16px;
  margin-top: 8px;
  animation: ${fadeUp} 0.4s ease-out 0.25s both;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 17px;
  background: ${({ $valid }) =>
    $valid
      ? `linear-gradient(135deg, ${C.brand} 0%, #1F8A7E 100%)`
      : '#D4CFC8'};
  color: ${({ $valid }) => $valid ? '#fff' : '#9E9994'};
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  cursor: ${({ $valid }) => $valid ? 'pointer' : 'not-allowed'};
  transition: all 0.2s;
  box-shadow: ${({ $valid }) => $valid ? `0 6px 24px ${C.brand}40` : 'none'};
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  animation: ${({ $valid }) => $valid ? css`${pulse} 2s ease-in-out infinite` : 'none'};

  &:active:not(:disabled) { transform: scale(0.98); }
`;

const Spinner = styled.span`
  width: 18px; height: 18px;
  border: 2.5px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  display: inline-block;
  animation: ${spin} 0.7s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
`;

// ─── Success modal ────────────────────────────────────────────────────────────
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);

  @media (min-width: 480px) { align-items: center; }
`;

const ModalCard = styled.div`
  background: ${C.card};
  border-radius: 24px 24px 0 0;
  padding: 36px 28px calc(36px + env(safe-area-inset-bottom, 0px));
  width: 100%;
  text-align: center;
  animation: ${popIn} 0.35s ease-out;

  @media (min-width: 480px) {
    border-radius: 24px;
    max-width: 380px;
    padding: 40px 32px;
  }
`;

const ModalEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const ModalTitle = styled.h2`
  font-size: 1.45rem;
  font-weight: 800;
  color: ${C.text};
  margin: 0 0 10px;
  letter-spacing: -0.02em;
`;

const ModalText = styled.p`
  font-size: 0.92rem;
  color: ${C.muted};
  line-height: 1.6;
  margin: 0 0 28px;
`;

const ModalBtn = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, ${C.brand} 0%, #1F8A7E 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px ${C.brand}40;
  -webkit-tap-highlight-color: transparent;
  &:active { transform: scale(0.98); }
`;

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #EBE8E2 25%, #F5F3EE 50%, #EBE8E2 75%);
  background-size: 300% 100%;
  animation: ${shimmer} 1.4s infinite;
  border-radius: 10px;
`;

const SkeletonHero = styled(SkeletonBase)`
  height: 180px;
  border-radius: 0;
  margin-bottom: 8px;
`;

const SkeletonCard = styled(SkeletonBase)`
  height: 64px;
  border-radius: 14px;
  margin-bottom: 10px;
`;

// ─── Field definitions ────────────────────────────────────────────────────────
const SECTIONS = [
  {
    title: 'Datos personales',
    fields: [
      { name: 'firstName',  label: 'Nombre',   type: 'text',   required: true, placeholder: 'Tu nombre' },
      { name: 'lastName',   label: 'Apellido',  type: 'text',   required: true, placeholder: 'Tu apellido' },
      { name: 'gender',     label: 'Sexo',      type: 'select', required: true,
        options: [
          { value: '', label: 'Selecciona tu sexo' },
          { value: 'Masculino',         label: 'Masculino' },
          { value: 'Femenino',          label: 'Femenino' },
          { value: 'Otro',              label: 'Otro' },
          { value: 'Prefiero no decir', label: 'Prefiero no decir' },
        ]},
      { name: 'age', label: 'Edad', type: 'number', required: true, placeholder: 'Ej: 28' },
    ],
  },
  {
    title: 'Contacto y ubicación',
    fields: [
      { name: 'phone_number',    label: 'Teléfono',           type: 'phone',  required: true },
      { name: 'city',            label: 'Ciudad',             type: 'text',   required: true, placeholder: 'Tu ciudad' },
      { name: 'residentialArea', label: 'Zona de residencia', type: 'text',   required: true, placeholder: 'Ej: Norte, Centro…' },
    ],
  },
  {
    title: 'Perfil del hogar',
    fields: [
      { name: 'purchaseResponsibility',
        label: '¿Responsable de compras del hogar?',
        type: 'select', required: true,
        options: [
          { value: '',             label: 'Selecciona una opción' },
          { value: 'Sí',           label: 'Sí' },
          { value: 'Parcialmente', label: 'Parcialmente' },
          { value: 'No',           label: 'No' },
        ]},
      { name: 'educationLevel',
        label: 'Nivel educativo',
        type: 'select', required: true,
        options: [
          { value: '',           label: 'Selecciona tu nivel' },
          { value: 'Primaria',   label: 'Primaria' },
          { value: 'Secundaria', label: 'Secundaria' },
          { value: 'Universidad',label: 'Universidad' },
          { value: 'Posgrado',   label: 'Posgrado' },
          { value: 'Otro',       label: 'Otro' },
        ]},
      { name: 'children',
        label: '¿Tienes hijos?',
        type: 'select', required: true,
        options: [
          { value: '', label: 'Selecciona una opción' },
          { value: 'Sí', label: 'Sí' },
          { value: 'No', label: 'No' },
        ]},
    ],
  },
];

const CHILDREN_FIELDS = [
  { name: 'children_count', label: '¿Cuántos hijos tienes?',          type: 'number', placeholder: 'Ej: 2',         required: true },
  { name: 'children_ages',  label: 'Edades de tus hijos (separadas por coma)', type: 'text', placeholder: 'Ej: 5, 8, 12', required: true },
];

// ─── Validation ───────────────────────────────────────────────────────────────
const validate = (form, hasChildren) => {
  const errors = {};
  const allFields = SECTIONS.flatMap(s => s.fields);
  allFields.forEach(({ name, required }) => {
    if (!required) return;
    const v = form[name];
    if (!v || (typeof v === 'string' && !v.trim())) errors[name] = 'Campo requerido';
  });
  if (hasChildren) {
    CHILDREN_FIELDS.forEach(({ name }) => {
      const v = form[name];
      if (!v || (typeof v === 'string' && !v.trim())) errors[name] = 'Campo requerido';
    });
  }
  return errors;
};

const allRequired = (form, hasChildren) =>
  Object.keys(validate(form, hasChildren)).length === 0;

const progressPct = (form, hasChildren) => {
  const allFields = [
    ...SECTIONS.flatMap(s => s.fields).filter(f => f.required),
    ...(hasChildren ? CHILDREN_FIELDS : []),
  ];
  const filled = allFields.filter(({ name }) => {
    const v = form[name];
    return v && (typeof v !== 'string' || v.trim());
  }).length;
  return Math.round((filled / allFields.length) * 100);
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function Profile() {
  const { authFetch, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form,        setForm]        = useState(null);
  const [errors,      setErrors]      = useState({});
  const [touched,     setTouched]     = useState({});
  const [saving,      setSaving]      = useState(false);
  const [showModal,   setShowModal]   = useState(false);
  const [saveError,   setSaveError]   = useState('');
  const [hasChildren, setHasChildren] = useState(false);

  // Carrega dados do usuário
  useEffect(() => {
    async function load() {
      try {
        const res = await authFetch('/users/me');
        const d   = res.data;
        if (d.phone_number && typeof d.phone_number !== 'string') d.phone_number = '';
        if (typeof d.children_ages === 'string') d.children_ages = d.children_ages.replace(/[{}]/g, '');
        setForm(d);
        setHasChildren(d.children === 'Sí' || d.children_count > 0);
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    }
    load();
  }, [authFetch]);

  // Recalcula erros sempre que form ou hasChildren mudam
  useEffect(() => {
    if (form) setErrors(validate(form, hasChildren));
  }, [form, hasChildren]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    if (name === 'children') setHasChildren(value === 'Sí');
  }, []);

  const handlePhone = useCallback((value) => {
    setForm(prev => ({ ...prev, phone_number: value || '' }));
    setTouched(prev => ({ ...prev, phone_number: true }));
  }, []);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = async () => {
    // Marca todos os campos como tocados para mostrar erros
    const allNames = [
      ...SECTIONS.flatMap(s => s.fields).map(f => f.name),
      ...(hasChildren ? CHILDREN_FIELDS.map(f => f.name) : []),
    ];
    setTouched(Object.fromEntries(allNames.map(n => [n, true])));

    const currentErrors = validate(form, hasChildren);
    if (Object.keys(currentErrors).length > 0) {
      // Scroll ao primeiro campo com erro
      const first = Object.keys(currentErrors)[0];
      document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        ...form,
        phone_number:  form.phone_number || null,
        childrenCount: hasChildren ? (parseInt(form.children_count) || null) : null,
        childrenAges:  hasChildren
          ? (form.children_ages || '').split(',').map(a => parseInt(a.trim())).filter(n => !isNaN(n))
          : [],
      };
      await authFetch('/users/me', { method: 'PATCH', data: payload });
      setShowModal(true);
    } catch (e) {
      console.error('Error saving profile:', e);
      setSaveError('Error al guardar. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (!form) return (
    <Page>
      <SkeletonHero />
      <div style={{ padding: '0 16px' }}>
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} style={{ animationDelay: `${i * 0.07}s` }} />)}
      </div>
    </Page>
  );

  const pct      = progressPct(form, hasChildren);
  const isValid  = allRequired(form, hasChildren);
  const initials = `${form.firstName?.[0] || ''}${form.lastName?.[0] || ''}`.toUpperCase() || '👤';

  const pctMsg = pct === 100 ? '¡Perfil completo! 🎉'
    : pct > 70 ? '¡Casi listo! 💪'
    : pct > 40 ? '¡Vas muy bien! 🙌'
    : '¡Empecemos! 😄';

  // ── Render field ───────────────────────────────────────────────────────────
  const renderField = (field) => {
    const { name, label, type, options, placeholder, required } = field;
    const hasErr  = touched[name] && errors[name];
    const value   = form[name] ?? '';

    return (
      <FieldCard key={name} $error={hasErr} id={`field-${name}`}>
        <FieldInner>
          <FieldLabel htmlFor={name} $error={hasErr}>
            {label}{required && ' *'}
          </FieldLabel>

          {type === 'phone' ? (
            <PhoneWrap>
              <PhoneInput
                id={name}
                international
                value={value}
                onChange={handlePhone}
                onBlur={() => handleBlur(name)}
                placeholder="+1 (555) 000-0000"
              />
            </PhoneWrap>
          ) : type === 'select' ? (
            <SelectArrow>
              <FieldSelect
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                onBlur={() => handleBlur(name)}
              >
                {options.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </FieldSelect>
            </SelectArrow>
          ) : (
            <FieldInput
              id={name}
              name={name}
              type={type}
              value={value}
              placeholder={placeholder}
              onChange={handleChange}
              onBlur={() => handleBlur(name)}
              autoComplete={name === 'firstName' ? 'given-name' : name === 'lastName' ? 'family-name' : 'off'}
            />
          )}
        </FieldInner>
        {hasErr && <FieldError>{errors[name]}</FieldError>}
      </FieldCard>
    );
  };

  return (
    <Page>
      {/* ── Hero ── */}
      <Hero>
        <AvatarWrap>
          <Avatar>{initials}</Avatar>
        </AvatarWrap>
        <HeroName>
          {form.firstName ? `${form.firstName} ${form.lastName || ''}`.trim() : 'Tu perfil'}
        </HeroName>
        <HeroSub>
          {form.email || 'Completa tu información para recibir más encuestas'}
        </HeroSub>
      </Hero>

      {/* ── Barra de progresso ── */}
      <ProgressPillWrap>
        <ProgressCard>
          <ProgressMsg>{pctMsg}</ProgressMsg>
          <ProgressTrack>
            <ProgressFill $pct={pct} />
          </ProgressTrack>
          <ProgressPct $done={pct === 100}>{pct}%</ProgressPct>
        </ProgressCard>
      </ProgressPillWrap>

      {/* ── Secciones ── */}
      <FormArea>
        {SECTIONS.map((section) => (
          <React.Fragment key={section.title}>
            <SectionTitle>{section.title}</SectionTitle>
            {section.fields.map(renderField)}
          </React.Fragment>
        ))}

        {/* Campos de hijos condicionales */}
        {hasChildren && (
          <>
            <SectionTitle>Información sobre tus hijos</SectionTitle>
            {CHILDREN_FIELDS.map(renderField)}
          </>
        )}
      </FormArea>

      {/* ── Botão ── */}
      <SubmitWrap>
        {saveError && (
          <p style={{ color: C.error, fontSize: '0.85rem', textAlign: 'center', marginBottom: 12 }}>
            {saveError}
          </p>
        )}
        <SubmitBtn $valid={isValid && !saving} onClick={handleSubmit} disabled={saving}>
          {saving ? <><Spinner />Guardando…</> : isValid ? '✓ Guardar cambios' : 'Completa los campos requeridos'}
        </SubmitBtn>
      </SubmitWrap>

      {/* ── Modal de sucesso ── */}
      {showModal && (
        <Overlay>
          <ModalCard>
            <ModalEmoji>🎉</ModalEmoji>
            <ModalTitle>¡Perfil actualizado!</ModalTitle>
            <ModalText>
              Tu información fue guardada correctamente. Recibirás encuestas adaptadas a tu perfil.
            </ModalText>
            <ModalBtn onClick={() => { setShowModal(false); navigate('/'); }}>
              Ir al inicio
            </ModalBtn>
          </ModalCard>
        </Overlay>
      )}
    </Page>
  );
}
