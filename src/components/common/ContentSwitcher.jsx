import Loading from '../common/Loader/Loading';
import ErrorMessage from '../common/ErrorMessage';
import UsersList from '../user/UsersList';

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