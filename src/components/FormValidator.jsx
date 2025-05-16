import { useEffect } from 'react';

export default function FormValidator({ form, setFormValid }) {
  useEffect(() => {
    if (!form) {
      setFormValid(false);
      return;
    }

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


    const allFilled = requiredFields.every(
      (field) =>
        form[field] !== undefined &&
        form[field] !== null &&
        String(form[field]).trim() !== ''
    );

    setFormValid(allFilled);
  }, [form, setFormValid]);

  return null; 
}
