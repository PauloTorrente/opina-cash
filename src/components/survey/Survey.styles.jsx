import styled, { keyframes, css } from 'styled-components';

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideRight = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.88); }
  65%  { transform: scale(1.03); }
  100% { opacity: 1; transform: scale(1); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.05); opacity: 0.85; }
`;

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`;

const checkPop = keyframes`
  0%   { transform: scale(0); }
  60%  { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

// ─── Design Tokens ────────────────────────────────────────────────────────────

const C = {
  brand:    '#5B4FE9',
  brand2:   '#43B89C',
  brandDk:  '#4338CA',
  danger:   '#EF4444',
  warning:  '#F59E0B',
  success:  '#10B981',
  text:     '#111827',
  textMid:  '#374151',
  muted:    '#6B7280',
  border:   '#E5E7EB',
  bg:       '#F9FAFB',
  bgCard:   '#FFFFFF',
  shadow:   'rgba(91,79,233,0.08)',
};

// ─── Global reset helpers ─────────────────────────────────────────────────────

const touchTarget = css`
  min-height: 48px;
  display: flex;
  align-items: center;
`;

// ─── Page Layout ─────────────────────────────────────────────────────────────

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${C.bg};
  padding-bottom: env(safe-area-inset-bottom, 24px);
`;

export const Container = styled.div`
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 16px 12px 100px;
  animation: ${fadeUp} 0.4s ease-out both;

  @media (min-width: 480px) { padding: 24px 20px 100px; }
  @media (min-width: 640px) { padding: 36px 24px 100px; }
`;

// ─── Survey Header ────────────────────────────────────────────────────────────

export const SurveyHeader = styled.div`
  background: linear-gradient(140deg, ${C.brand} 0%, #7C3AED 55%, #2563EB 100%);
  border-radius: 20px;
  padding: 28px 24px 24px;
  margin-bottom: 20px;
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(91,79,233,0.28);

  /* Decorative circles */
  &::before {
    content: '';
    position: absolute;
    top: -50px; right: -30px;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -40px; left: -20px;
    width: 140px; height: 140px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    pointer-events: none;
  }

  @media (min-width: 480px) { padding: 32px 28px 28px; }
`;

export const Title = styled.h1`
  font-size: 1.45rem;
  font-weight: 800;
  margin: 0 0 6px;
  color: #fff;
  line-height: 1.25;
  position: relative;
  z-index: 1;
  letter-spacing: -0.02em;

  @media (min-width: 480px) { font-size: 1.75rem; }
`;

export const SurveyDescription = styled.p`
  font-size: 0.95rem;
  color: rgba(255,255,255,0.82);
  margin: 0 0 4px;
  line-height: 1.55;
  position: relative;
  z-index: 1;
`;

export const ProgressBar = styled.div`
  margin-top: 20px;
  position: relative;
  z-index: 1;
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.76rem;
  color: rgba(255,255,255,0.75);
  margin-bottom: 7px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

export const ProgressTrack = styled.div`
  height: 7px;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,1));
  border-radius: 4px;
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite;
    display: ${({ $pct }) => $pct > 0 && $pct < 100 ? 'block' : 'none'};
  }
`;

// ─── Question Card ────────────────────────────────────────────────────────────

export const QuestionContainer = styled.div`
  background: ${C.bgCard};
  border-radius: 18px;
  padding: 20px 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px ${C.shadow};
  border: 1.5px solid ${C.border};
  animation: ${slideRight} 0.3s ease-out both;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s;
  -webkit-tap-highlight-color: transparent;

  &:active { transform: scale(0.995); }

  @media (min-width: 480px) { padding: 24px 20px; }
`;

export const QuestionText = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${C.text};
  margin: 0 0 16px;
  line-height: 1.5;

  @media (min-width: 480px) { font-size: 1.05rem; }
`;

export const Message = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${C.muted};
  margin-bottom: 16px;
`;

// ─── Question Header Row ──────────────────────────────────────────────────────

export const QuestionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${C.border};
  gap: 8px;
  flex-wrap: wrap;
`;

export const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 4px 10px;
  border-radius: 20px;
  background: ${({ $color }) => $color + '18'};
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $color }) => $color + '28'};
  white-space: nowrap;
`;

export const RequiredBadge = styled.span`
  font-size: 0.7rem;
  color: ${C.danger};
  font-weight: 700;
  background: #FEF2F2;
  padding: 4px 9px;
  border-radius: 12px;
  border: 1px solid #FECACA;
  white-space: nowrap;
`;

// ─── Selection Limit UI ───────────────────────────────────────────────────────

export const LimitRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

export const LimitTrack = styled.div`
  flex: 1;
  height: 5px;
  background: ${C.border};
  border-radius: 3px;
  overflow: hidden;
`;

export const LimitFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => Math.min(100, $pct)}%;
  background: ${({ $pct }) =>
    $pct >= 100 ? C.danger : $pct >= 70 ? C.warning : C.success};
  border-radius: 3px;
  transition: width 0.3s ease, background-color 0.3s;
`;

export const LimitCount = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ $atLimit }) => $atLimit ? C.danger : C.muted};
  white-space: nowrap;
  min-width: 32px;
  text-align: right;
`;

export const LimitWarning = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 10px;
  color: ${C.danger};
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 12px;
`;

export const SelectionLimitInfo = styled.div`
  font-size: 0.8rem;
  padding: 4px 10px;
  background: ${({ $isAtLimit }) => $isAtLimit ? '#FEF2F2' : '#ECFDF5'};
  color: ${({ $isAtLimit }) => $isAtLimit ? C.danger : C.success};
  border-radius: 12px;
  font-weight: 600;
  border: 1px solid ${({ $isAtLimit }) => $isAtLimit ? '#FECACA' : '#A7F3D0'};
`;

// ─── Options ─────────────────────────────────────────────────────────────────

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const OptionalItem = styled.label`
  ${touchTarget}
  gap: 13px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1.5px solid ${({ $selected }) => $selected ? C.brand : C.border};
  background: ${({ $selected, $disabled }) =>
    $selected ? C.brand + '0D' : $disabled ? '#FAFAFA' : C.bgCard};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  transition: all 0.15s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  &:active:not(:disabled) {
    transform: scale(0.98);
    background: ${C.brand}10;
  }

  @media (hover: hover) {
    &:hover:not([data-disabled="true"]) {
      border-color: ${C.brand}80;
      background: ${({ $selected }) => $selected ? C.brand + '0D' : C.brand + '06'};
    }
  }
`;

export const OptionLabel = styled.span`
  font-size: 0.95rem;
  color: ${({ $disabled }) => $disabled ? C.muted : C.textMid};
  font-weight: ${({ $selected }) => $selected ? '600' : '400'};
  flex: 1;
  line-height: 1.45;
`;

export const DisabledHint = styled.span`
  font-size: 0.7rem;
  color: ${C.danger};
  font-style: italic;
  margin-left: 4px;
`;

export const RadioInput = styled.input.attrs({ type: 'radio' })`
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 2px solid ${({ checked }) => checked ? C.brand : '#D1D5DB'};
  border-radius: 50%;
  background: ${({ checked }) => checked ? C.brand : C.bgCard};
  cursor: pointer;
  position: relative;
  transition: all 0.15s;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) scale(${({ checked }) => checked ? 1 : 0});
    transition: transform 0.15s;
  }
  &:focus-visible { outline: none; box-shadow: 0 0 0 3px ${C.brand}30; }
`;

export const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 2px solid ${({ checked }) => checked ? C.brand : '#D1D5DB'};
  border-radius: 6px;
  background: ${({ checked }) => checked ? C.brand : C.bgCard};
  cursor: pointer;
  position: relative;
  transition: all 0.15s;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    left: 5px; top: 2px;
    width: 6px; height: 10px;
    border: 2.5px solid white;
    border-top: none; border-left: none;
    transform: rotate(45deg) scale(${({ checked }) => checked ? 1 : 0});
    transform-origin: bottom right;
    transition: transform 0.12s ease;
    animation: ${({ checked }) => checked ? css`${checkPop} 0.2s ease-out` : 'none'};
  }
  &:focus-visible { outline: none; box-shadow: 0 0 0 3px ${C.brand}30; }
  &:disabled { cursor: not-allowed; }
`;

export const OtherInputWrapper = styled.div`
  margin-top: 8px;
  margin-left: 33px;
  animation: ${fadeUp} 0.2s ease-out both;
`;

// ─── Text Input / Textarea ────────────────────────────────────────────────────

export const InputFieldStyled = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1.5px solid ${({ $invalid }) =>
    $invalid === true ? C.danger : $invalid === false ? C.success : C.border};
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.5;
  background: ${C.bg};
  color: ${C.text};
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  -webkit-appearance: none;
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${C.brand};
    box-shadow: 0 0 0 3px ${C.brand}20;
    background: ${C.bgCard};
  }
  &::placeholder { color: #9CA3AF; }
`;

// ─── Character Counter ────────────────────────────────────────────────────────

export const CharCounterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 6px;
`;

export const CharCounter = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $over, $warn }) => $over ? C.danger : $warn ? C.warning : C.muted};
  transition: color 0.2s;
`;

// ─── Media ────────────────────────────────────────────────────────────────────

export const MediaContainer = styled.div`
  margin: 14px 0;
  border-radius: 14px;
  overflow: hidden;
  background: #F3F4F6;
`;

export const ResponsiveImage = styled.img`
  width: 100%;
  height: auto;
  max-height: ${({ $isVertical }) => $isVertical ? '400px' : '220px'};
  object-fit: ${({ $isVertical }) => $isVertical ? 'contain' : 'cover'};
  display: block;
`;

export const ResponsiveVideo = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  overflow: hidden;
  border-radius: 14px;
  background: #000;

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

// ─── Submit Button ────────────────────────────────────────────────────────────

export const SubmitButton = styled.button`
  width: 100%;
  padding: 17px 20px;
  background: ${({ disabled }) =>
    disabled ? '#D1D5DB' : `linear-gradient(135deg, ${C.brand} 0%, #7C3AED 100%)`};
  color: ${({ disabled }) => disabled ? '#9CA3AF' : '#fff'};
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.01em;
  box-shadow: ${({ disabled }) => disabled ? 'none' : `0 6px 24px rgba(91,79,233,0.35)`};
  margin-top: 20px;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(91,79,233,0.42);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 16px rgba(91,79,233,0.28);
  }
`;

export const SpinnerIcon = styled.span`
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  display: inline-block;
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;
`;

// ─── Warning / Terms ──────────────────────────────────────────────────────────

export const WarningBox = styled.div`
  background: #FFFBEB;
  border: 1.5px solid #FDE68A;
  border-radius: 16px;
  padding: 18px 16px;
  margin: 20px 0;
`;

export const WarningTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #92400E;
  font-size: 0.92rem;
  margin-bottom: 8px;
`;

export const WarningText = styled.p`
  color: #78350F;
  font-size: 0.88rem;
  line-height: 1.55;
  margin: 0 0 14px;
`;

export const TermsRow = styled.label`
  ${touchTarget}
  gap: 12px;
  cursor: pointer;
  padding: 14px 16px;
  background: ${C.bgCard};
  border-radius: 12px;
  border: 1.5px solid ${({ $checked }) => $checked ? C.brand2 : '#FDE68A'};
  transition: border-color 0.18s, background 0.18s;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &:active { transform: scale(0.99); }
`;

export const TermsCheckbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  min-width: 22px;
  border: 2px solid ${({ checked }) => checked ? C.brand2 : '#D4B600'};
  border-radius: 6px;
  background: ${({ checked }) => checked ? C.brand2 : C.bgCard};
  cursor: pointer;
  position: relative;
  transition: all 0.18s;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    left: 6px; top: 3px;
    width: 7px; height: 11px;
    border: 2.5px solid white;
    border-top: none; border-left: none;
    transform: rotate(45deg) scale(${({ checked }) => checked ? 1 : 0});
    transform-origin: bottom right;
    transition: transform 0.14s ease;
  }
  &:focus-visible { outline: none; box-shadow: 0 0 0 3px ${C.brand2}30; }
`;

export const TermsLabel = styled.span`
  font-size: 0.88rem;
  font-weight: 600;
  color: #78350F;
  line-height: 1.4;
`;

// ─── Modal ────────────────────────────────────────────────────────────────────

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9999;
  padding: 0;
  backdrop-filter: blur(5px);

  @media (min-width: 480px) {
    align-items: center;
    padding: 20px;
  }
`;

export const ModalContent = styled.div`
  background: ${C.bgCard};
  border-radius: 24px 24px 0 0;
  padding: 32px 24px calc(32px + env(safe-area-inset-bottom, 0px));
  width: 100%;
  text-align: center;
  box-shadow: 0 -8px 40px rgba(0,0,0,0.15);
  animation: ${popIn} 0.35s ease-out;

  @media (min-width: 480px) {
    border-radius: 24px;
    max-width: 420px;
    padding: 40px 32px;
  }
`;

export const ModalIcon = styled.div`
  width: 76px;
  height: 76px;
  background: linear-gradient(135deg, ${C.brand2} 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2.2rem;
  box-shadow: 0 8px 24px rgba(67,184,156,0.35);
`;

export const ModalTitle = styled.h2`
  font-size: 1.45rem;
  font-weight: 800;
  color: ${C.text};
  margin: 0 0 10px;
  letter-spacing: -0.02em;
`;

export const ModalText = styled.p`
  font-size: 0.95rem;
  color: ${C.muted};
  line-height: 1.6;
  margin: 0 0 28px;
`;

export const ModalButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, ${C.brand} 0%, #7C3AED 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(91,79,233,0.3);
  -webkit-tap-highlight-color: transparent;

  &:active { transform: scale(0.98); }
`;

// ─── State Pages ──────────────────────────────────────────────────────────────

export const StatePageWrapper = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

export const StateCard = styled.div`
  background: ${C.bgCard};
  border-radius: 24px;
  padding: 40px 28px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 40px ${C.shadow};
  border: 1.5px solid ${C.border};
  animation: ${popIn} 0.4s ease-out;
`;

export const StateIcon = styled.div`
  width: 80px; height: 80px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg || `linear-gradient(135deg, ${C.brand} 0%, #7C3AED 100%)`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  margin: 0 auto 24px;
  box-shadow: ${({ $shadow }) => $shadow || `0 8px 24px rgba(91,79,233,0.25)`};
`;

export const StateTitle = styled.h2`
  font-size: 1.45rem;
  font-weight: 800;
  color: ${C.text};
  margin: 0 0 12px;
  letter-spacing: -0.02em;
`;

export const StateMessage = styled.p`
  font-size: 0.97rem;
  color: ${C.muted};
  line-height: 1.6;
  margin: 0 0 28px;
`;

export const CountdownBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${C.bg};
  border: 1.5px solid ${C.border};
  border-radius: 30px;
  font-size: 0.86rem;
  font-weight: 600;
  color: ${C.muted};
  margin-bottom: 20px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

export const HomeButton = styled.button`
  padding: 14px 28px;
  background: linear-gradient(135deg, ${C.brand} 0%, #7C3AED 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(91,79,233,0.28);
  -webkit-tap-highlight-color: transparent;

  &:active { transform: scale(0.97); }
`;

// ─── Loading / Error ──────────────────────────────────────────────────────────

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
`;

export const LoadingSpinnerLarge = styled.div`
  width: 48px; height: 48px;
  border: 4px solid ${C.brand}20;
  border-top-color: ${C.brand};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingText = styled.p`
  font-size: 0.97rem;
  color: ${C.muted};
  font-weight: 500;
`;

export const ErrorCard = styled.div`
  background: #FFF5F5;
  border: 1.5px solid #FECACA;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  max-width: 480px;
  margin: 40px auto;
`;

// ─── Legacy aliases ───────────────────────────────────────────────────────────
export const AlreadyRespondedContainer = StateCard;
export const TimerContainer            = CountdownBadge;
export const RedirectText              = StateMessage;
export const ResponseLimitContainer    = StateCard;
export const WarningMessage            = WarningBox;

export const Select = styled.select`
  width: 100%;
  padding: 13px 16px;
  border-radius: 12px;
  border: 1.5px solid ${C.border};
  font-size: 1rem;
  background: ${C.bg};
  appearance: none;
  color: ${C.text};
  cursor: pointer;
  font-family: inherit;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  &:hover { background: #F3F4F6; }
`;

// ─── Aliases usados em outros componentes ─────────────────────────────────────
export const RadioLabel    = OptionLabel;
export const CheckboxLabel = OptionLabel;
export const CheckboxLabel2 = styled.span`
  font-size: 0.95rem;
  color: ${({ $disabled }) => $disabled ? C.muted : C.textMid};
  flex: 1;
`;
export const OptionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 6px;
`;
export const SelectionTypeIndicator = TypeBadge;
