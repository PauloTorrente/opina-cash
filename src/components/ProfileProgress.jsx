import React from 'react';
import { ProgressBar, ProgressWrapper, Message } from '../components/Profile.styles';
import { motion } from 'framer-motion';

export default function ProfileProgress({ fields, form }) {
  const filledFields = fields.filter(
    (f) => form[f.name] && form[f.name] !== ''
  ).length;
  const progress = (filledFields / fields.length) * 100;

  const getMessage = () => {
    if (progress === 100) return "¡Perfil completo! 🎉";
    if (progress > 70) return "¡Casi terminamos! 💪";
    if (progress > 40) return "¡Vas muy bien! 🙌";
    return "¡Empecemos! 😄";
  };

  return (
    <>
      <ProgressWrapper>
        <ProgressBar
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </ProgressWrapper>
      <Message>{getMessage()}</Message>
    </>
  );
}
