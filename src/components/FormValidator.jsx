import { useEffect } from 'react';

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

export default function FormValidator({ form, setFormValid, setInvalidFields }) {
  useEffect(() => {
    if (!form) {
      setFormValid(false);
      setInvalidFields([]);
      return;
    }

    const newInvalidFields = requiredFields.filter(field => {
      const value = form[field];
      return !value || (typeof value === 'string' && value.trim() === '');
    });

    setInvalidFields(newInvalidFields);
    setFormValid(newInvalidFields.length === 0);
  }, [form, setFormValid, setInvalidFields]);

  return null;
}