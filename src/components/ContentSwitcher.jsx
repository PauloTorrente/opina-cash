import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import UsersList from './UsersList';

export default function ContentSwitcher({
  loading,
  error,
  filteredUsers,
  hasActiveFilters,
  clearFilters,
  totalCount
}) {
  return (
    <>
      {loading ? (
        <Loading message="Cargando información de usuarios..." />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <UsersList
          filteredUsers={filteredUsers}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          totalCount={totalCount}
        />
      )}
    </>
  );
}