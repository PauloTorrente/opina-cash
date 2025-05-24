import React from 'react';

const UsersFilter = ({ users, filters, searchTerm }) => {
  return users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || (
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.city?.toLowerCase().includes(searchLower) ||
      user.residentialArea?.toLowerCase().includes(searchLower) || // Novo campo adicionado
      user.phone_number?.includes(searchTerm)
    );

    const matchesStatus = filters.status === '' || 
      (filters.status === 'confirmed' && user.isConfirmed) || 
      (filters.status === 'unconfirmed' && !user.isConfirmed);
    
    const matchesRole = filters.role === '' || 
      user.role?.toLowerCase() === filters.role.toLowerCase();
    
    const matchesChildren = filters.hasChildren === '' || 
      (filters.hasChildren === 'yes' && user.children_count > 0) || // Corrigido childrenCount para children_count
      (filters.hasChildren === 'no' && (!user.children_count || user.children_count === 0));
    
    const matchesMinBalance = filters.minBalance === '' || 
      (user.walletBalance >= parseFloat(filters.minBalance));
    
    const matchesMaxBalance = filters.maxBalance === '' || 
      (user.walletBalance <= parseFloat(filters.maxBalance));

    const matchesGender = filters.gender === '' || 
      user.gender === filters.gender;
    
    const matchesPurchaseResponsibility = filters.purchaseResponsibility === '' || 
      user.purchaseResponsibility === filters.purchaseResponsibility;
    
    const matchesEducationLevel = filters.educationLevel === '' || 
      user.educationLevel === filters.educationLevel;

    return (
      matchesSearch && 
      matchesStatus && 
      matchesRole && 
      matchesChildren && 
      matchesMinBalance && 
      matchesMaxBalance &&
      matchesGender &&
      matchesPurchaseResponsibility &&
      matchesEducationLevel
    );
  });
};

export default UsersFilter;
