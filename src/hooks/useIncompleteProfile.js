import { useContext, useMemo } from 'react';
import AuthContext from '../context/AuthContext';

export function useIncompleteProfile() {
  const { user } = useContext(AuthContext);

  return useMemo(() => {
    if (!user) return { needsBasicInfo: false, missingFieldsCount: 0 };
    
    // Agora só validamos o phone_number
    const hasPhoneNumber = !!user.phone_number?.trim();
    
    return {
      needsBasicInfo: !hasPhoneNumber,
      missingFieldsCount: hasPhoneNumber ? 0 : 1
    };
  }, [user]);
}