import { useState, useMemo } from 'react';

// ─── Desserialização segura ───────────────────────────────────────────────────
const parseQuestions = (questions) => {
  if (!questions) return [];
  if (Array.isArray(questions)) return questions;
  try {
    let parsed = typeof questions === 'string' ? JSON.parse(questions) : questions;
    if (typeof parsed === 'string') parsed = JSON.parse(parsed);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
};

// ─── Normalização ─────────────────────────────────────────────────────────────
const normalizeQuestions = (questions) => {
  return questions.map((q) => {
    const isMultiple = q.multipleSelections === 'yes' || q.multipleSelections === true;
    let selectionLimit = null;
    if (isMultiple && q.selectionLimit != null && q.selectionLimit !== '') {
      const n = Number(q.selectionLimit);
      if (!isNaN(n) && n > 0) selectionLimit = Math.min(n, q.options?.length ?? n);
    }
    return { ...q, selectionLimit };
  });
};

// ─── Estado inicial ───────────────────────────────────────────────────────────
const buildInitialResponses = (questions) => {
  const init = {};
  questions.forEach((q) => {
    const isMultiple = q.multipleSelections === 'yes' || q.multipleSelections === true;
    if (q.type === 'multiple' && q.otherOption) {
      init[q.questionId] = isMultiple
        ? { selectedOptions: [], otherText: '' }
        : { selectedOption: null, otherText: '' };
    } else if (q.type === 'multiple' && isMultiple) {
      init[q.questionId] = [];
    } else {
      init[q.questionId] = '';
    }
  });
  return init;
};

// ─── Limites de texto ─────────────────────────────────────────────────────────
const TEXT_LIMITS = {
  short:        { min: 1,  max: 100 },
  medium:       { min: 10, max: 300 },
  long:         { min: 50, max: 1000 },
  unrestricted: { min: 0,  max: Infinity },
};
const getLengthConfig = (answerLength) =>
  TEXT_LIMITS[(answerLength || 'unrestricted').toLowerCase().trim()] ?? TEXT_LIMITS.unrestricted;

// ─── Detectar "Nunca" selecionado ─────────────────────────────────────────────
// Retorna true se a resposta é a opção "Nunca" (encerra a enquete)
const isNeverSelected = (q, answer) => {
  if (q.type !== 'multiple') return false;
  const isMultiple = q.multipleSelections === 'yes' || q.multipleSelections === true;
  if (isMultiple) return false;
  const selected = q.otherOption ? (answer?.selectedOption ?? null) : answer;
  return typeof selected === 'string' && selected.trim().toLowerCase() === 'nunca';
};

// ─── Detectar pergunta condicional ("Si seleccionaste Otro...") ──────────────
// Detecta se a pergunta só deve aparecer quando a anterior teve "Otro"
const isConditionalOnOtro = (q) => {
  const text = (q.question || '').toLowerCase();
  return (
    text.includes("si seleccionaste 'otro'") ||
    text.includes('si seleccionaste "otro"') ||
    text.includes('si seleccionaste otro') ||
    text.includes('si respondiste otro') ||
    text.includes('si elegiste otro') ||
    text.includes('si marcaste otro') ||
    (/si (seleccionaste|respondiste|elegiste|marcaste)/.test(text) && text.includes('otro'))
  );
};

// ─── Verificar se a pergunta anterior tem "Otro" selecionado ──────────────────
const prevHasOtroSelected = (questions, currentIndex, responses) => {
  if (currentIndex === 0) return false;
  const prev = questions[currentIndex - 1];
  if (!prev) return false;
  const ans  = responses[prev.questionId];
  const isMultiple = prev.multipleSelections === 'yes' || prev.multipleSelections === true;

  // Pergunta com otherOption estruturado
  if (prev.otherOption) {
    if (isMultiple) return (ans?.selectedOptions ?? []).includes('other');
    return ans?.selectedOption === 'other';
  }
  // Opção "Otro" explícita nas options
  const selected = isMultiple
    ? (Array.isArray(ans) ? ans : [])
    : (ans ? [ans] : []);
  return selected.some(s => typeof s === 'string' && s.toLowerCase() === 'otro');
};

// ─── Validação de uma resposta ────────────────────────────────────────────────
const isQuestionValid = (q, answer, index, allQuestions, responses) => {
  const isMultiple = q.multipleSelections === 'yes' || q.multipleSelections === true;
  const required   = q.required === true || q.required === 'yes';

  // PROBLEMA 7: pergunta condicional — só valida se anterior teve "Otro"
  if (isConditionalOnOtro(q)) {
    if (!prevHasOtroSelected(allQuestions, index, responses)) return true; // oculta → válida
    // Está visível (anterior = Otro): texto obrigatório
    const text = (answer || '').trim();
    return text.length > 0;
  }

  if (q.type === 'text') {
    const text = (answer || '').trim();
    if (!required) { if (text.length === 0) return true; }
    else           { if (text.length === 0) return false; }
    const { min, max } = getLengthConfig(q.answerLength);
    return text.length >= min && text.length <= max;
  }

  if (q.otherOption) {
    if (isMultiple) {
      const selected = answer?.selectedOptions ?? [];
      if (required && selected.length === 0) return false;
      if (selected.includes('other') && !(answer?.otherText?.trim())) return false;
      if (q.selectionLimit && selected.length > q.selectionLimit) return false;
    } else {
      const sel = answer?.selectedOption ?? null;
      if (required && !sel) return false;
      if (sel === 'other' && !(answer?.otherText?.trim())) return false;
    }
    return true;
  }

  if (isMultiple) {
    const arr = Array.isArray(answer) ? answer : [];
    if (required && arr.length === 0) return false;
    if (q.selectionLimit && arr.length > q.selectionLimit) return false;
    return true;
  }

  if (required) return answer !== '' && answer !== null && answer !== undefined;
  return true;
};

// ─── Hook principal ───────────────────────────────────────────────────────────
export const useSurveyForm = ({ survey, accessToken, onResponseSuccess, onResponseError }) => {
  const normalizedQuestions = useMemo(() => {
    if (!survey?.questions) return [];
    return normalizeQuestions(parseQuestions(survey.questions));
  }, [survey]);

  const [responses,        setResponses]        = useState(() => buildInitialResponses(normalizedQuestions));
  const [showSuccessModal, setShowSuccessModal]  = useState(false);
  const [termsAccepted,    setTermsAccepted]    = useState(false);
  const [isSubmitting,     setIsSubmitting]     = useState(false);
  // PROBLEMA 1 & 3: índice onde "Nunca" foi selecionado (-1 = sem bloqueio)
  const [neverBlockedAt,   setNeverBlockedAt]   = useState(-1);

  // Perguntas visíveis: até o ponto do bloqueio por Nunca (inclusive)
  const visibleQuestions = useMemo(() => {
    if (neverBlockedAt === -1) return normalizedQuestions;
    return normalizedQuestions.slice(0, neverBlockedAt + 1);
  }, [normalizedQuestions, neverBlockedAt]);

  const handleResponseChange = (questionId, answer) => {
    const q     = normalizedQuestions.find(q => q.questionId === questionId);
    const index = normalizedQuestions.findIndex(q => q.questionId === questionId);
    if (!q) return;

    const isMultiple = q.multipleSelections === 'yes' || q.multipleSelections === true;
    if (isMultiple && q.selectionLimit) {
      const count = q.otherOption
        ? (answer?.selectedOptions?.length ?? 0)
        : (Array.isArray(answer) ? answer.length : 0);
      if (count > q.selectionLimit) return;
    }

    setResponses(prev => ({ ...prev, [questionId]: answer }));

    // PROBLEMA 1 & 3: detectar "Nunca" → bloquear resto da enquete
    if (isNeverSelected(q, answer)) {
      setNeverBlockedAt(index);
    } else if (index === neverBlockedAt) {
      setNeverBlockedAt(-1); // desmarcou Nunca → desbloquear
    }
  };

  const isNeverBlocked = neverBlockedAt !== -1;

  const allResponsesValid = useMemo(() => {
    // Se bloqueado por Nunca, só valida a pergunta que tinha Nunca
    return visibleQuestions.every((q, i) =>
      isQuestionValid(q, responses[q.questionId], i, visibleQuestions, responses)
    );
  }, [responses, visibleQuestions]);

  const answeredCount = useMemo(() => {
    return visibleQuestions.filter((q, i) => {
      // Condicional sem Otro anterior → conta como respondida automaticamente
      if (isConditionalOnOtro(q) && !prevHasOtroSelected(visibleQuestions, i, responses)) return true;
      const r = responses[q.questionId];
      if (q.type === 'text') return (r || '').trim().length > 0;
      if (q.otherOption) {
        const isM = q.multipleSelections === 'yes' || q.multipleSelections === true;
        return isM ? (r?.selectedOptions?.length ?? 0) > 0 : !!r?.selectedOption;
      }
      if (q.multipleSelections === 'yes' || q.multipleSelections === true) {
        return Array.isArray(r) ? r.length > 0 : false;
      }
      return r !== '' && r !== null && r !== undefined;
    }).length;
  }, [responses, visibleQuestions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allResponsesValid || !termsAccepted) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token de autenticación no encontrado');

      // Enviar só as perguntas visíveis (sem as ocultadas pelo Nunca)
      const responseData = visibleQuestions.map((q, i) => {
        const questionId = !isNaN(Number(q.questionId))
          ? Number(q.questionId)
          : !isNaN(Number(q.id)) ? Number(q.id) : i + 1;
        return { questionId, answer: responses[q.questionId] };
      });

      const res = await fetch(
        `https://enova-backend.onrender.com/api/surveys/respond-permissive?accessToken=${accessToken}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(responseData),
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        let msg = txt;
        try { msg = JSON.parse(txt)?.message ?? txt; } catch {}
        throw new Error(msg || 'Error al enviar respuestas');
      }
      setShowSuccessModal(true);
      if (onResponseSuccess) onResponseSuccess();
    } catch (err) {
      console.error(err);
      if (onResponseError) onResponseError(err);
      const msg = err.message || '';
      if (msg.includes('already responded')) alert('¡Ya respondiste esta encuesta. Gracias!');
      else if (msg.includes('response limit')) alert('Esta encuesta alcanzó el límite de respuestas.');
      else alert(`Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    responses, showSuccessModal, termsAccepted, isSubmitting,
    formComplete: allResponsesValid && termsAccepted,
    allResponsesValid, answeredCount,
    normalizedQuestions: visibleQuestions,
    isNeverBlocked,
    neverBlockedAt,
    handleResponseChange,
    handleTermsChange: (e) => setTermsAccepted(e.target.checked),
    handleSubmit,
    closeModal: () => setShowSuccessModal(false),
  };
};
