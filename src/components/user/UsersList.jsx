import React from 'react';
import ResultsHeader from '../results/ResultsHeader';
import UserCard from '../common/Card/UserCard';
import NoResults from '../common/NoResults';

const UsersList = ({ filteredUsers, hasActiveFilters, clearFilters, totalCount }) => {
  return (
    <>
      {filteredUsers.length === 0 ? (
        <NoResults 
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
        />
      ) : (
        <>
          <ResultsHeader 
            filteredCount={filteredUsers.length}
            totalCount={totalCount}
            hasActiveFilters={hasActiveFilters}
            onClear={clearFilters}
          />
          
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </>
      )}
    </>
  );
};

export default UsersList;
