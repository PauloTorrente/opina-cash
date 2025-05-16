import { useContext, useMemo } from 'react';
import AuthContext from '../context/AuthContext';

export function useIncompleteProfile() {
  const { user } = useContext(AuthContext);

  return useMemo(() => {
    if (!user) return false;
    
    const required = [
      'firstName',
      'lastName',
      'gender',
      'age',
      'city',
      'residentialArea',
      'purchaseResponsibility',
      'educationLevel'
    ];
    
    const hasphone_number = !!user.phone_number;
    const hasBasicInfo = required.some(key => !user[key]);
    
    return {
      needsBasicInfo: hasBasicInfo,
      hasphone_number
    };
  }, [user]);
}