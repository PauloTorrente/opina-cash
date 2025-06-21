import React from 'react';
import Input from '../common/Input/InputField';
import { FieldContainer, Label } from '../user/Profile.styles';

export default function ChildrenFields({ form, handleChange }) {
  return (
    <>
      <FieldContainer>
        <Label>¿Cuántos hijos tienes?</Label>
        <Input
          name="children_count"
          value={form.children_count || ''}
          onChange={handleChange}
        />
      </FieldContainer>
      <FieldContainer>
        <Label>¿Cuáles son las edades de tus hijos?</Label>
        <Input
          name="children_ages"
          value={form.children_ages || ''}
          onChange={handleChange}
        />
      </FieldContainer>
    </>
  );
}