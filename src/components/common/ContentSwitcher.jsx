import Loading from '../common/Loader/Loading';
import ErrorMessage from '../common/ErrorMessage';
import UsersList from '../user/UsersList';
import { useTranslation } from '../../i18n/LanguageContext';

export default function ContentSwitcher({
  loading,
  error,
  filteredUsers,
  hasActiveFilters,
  clearFilters,
  totalCount
}) {
  const { t } = useTranslation();
  return (
    <>
      {loading ? (
        <Loading message={t('common.loadingUsers')} />
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