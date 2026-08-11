import { 
  FaUserShield, FaEnvelope, FaCheckCircle, FaTimesCircle, 
  FaCalendarAlt, FaVenusMars, FaBirthdayCake, FaPhone, 
  FaCity, FaHome, FaShoppingCart, FaBaby, 
  FaGraduationCap, FaWallet, FaUserEdit 
} from 'react-icons/fa';
import styled from 'styled-components';
import { useTranslation } from '../../../i18n/LanguageContext';

const UserCardContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  padding: 1.2rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  border-left: 4px solid ${props => props.isAdmin ? '#e74c3c' : props.isConfirmed ? '#2ecc71' : '#f39c12'};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  }
`;

const CardRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
`;

const CardLabel = styled.span`
  font-weight: bold;
  color: #7f8c8d;
  min-width: 120px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const CardValue = styled.span`
  color: #2c3e50;
  flex: 1;
`;

const Badge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-left: 0.5rem;
`;

const SuccessBadge = styled(Badge)`
  background-color: #2ecc71;
  color: white;
`;

const DangerBadge = styled(Badge)`
  background-color: #e74c3c;
  color: white;
`;

const WarningBadge = styled(Badge)`
  background-color: #f39c12;
  color: white;
`;

const InfoBadge = styled(Badge)`
  background-color: #3498db;
  color: white;
`;

function UserCard({ user }) {
  const { t, language } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return t('userCard.notAvailable');
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'pt-BR' ? 'pt-BR' : 'es-ES');
  };

  return (
    <UserCardContainer 
      isAdmin={user.role === 'admin'}
      isConfirmed={user.isConfirmed}
    >
      <CardRow>
        <CardLabel><FaUserShield /> {t('userCard.id')}</CardLabel>
        <CardValue>{user.id}</CardValue>
      </CardRow>

      <CardRow>
        <CardLabel><FaUserShield /> {t('userCard.name')}</CardLabel>
        <CardValue>
          {`${user.firstName} ${user.lastName}`}
          {user.role === 'admin' ? (
            <DangerBadge><FaUserShield /> {t('userCard.admin')}</DangerBadge>
          ) : (
            <InfoBadge><FaUserShield /> {user.role}</InfoBadge>
          )}
        </CardValue>
      </CardRow>

      <CardRow>
        <CardLabel><FaEnvelope /> {t('userCard.email')}</CardLabel>
        <CardValue>{user.email}</CardValue>
      </CardRow>

      <CardRow>
        <CardLabel><FaCheckCircle /> {t('userCard.status')}</CardLabel>
        <CardValue>
          {user.isConfirmed ? (
            <SuccessBadge><FaCheckCircle /> {t('userCard.confirmed')}</SuccessBadge>
          ) : (
            <WarningBadge><FaTimesCircle /> {t('userCard.unconfirmed')}</WarningBadge>
          )}
        </CardValue>
      </CardRow>

      <CardRow>
        <CardLabel><FaCalendarAlt /> {t('userCard.registered')}</CardLabel>
        <CardValue>{formatDate(user.createdAt)}</CardValue>
      </CardRow>

      <CardRow>
        <CardLabel><FaVenusMars /> {t('userCard.gender')}</CardLabel>
        <CardValue>{user.gender || t('userCard.unspecified')}</CardValue>
      </CardRow>

      <CardRow>
        <CardLabel><FaBirthdayCake /> {t('userCard.age')}</CardLabel>
        <CardValue>{user.age || '--'}</CardValue>
      </CardRow>

      <CardRow>
        <CardLabel><FaPhone /> {t('userCard.phone')}</CardLabel>
        <CardValue>{user.phone_number || '--'}</CardValue>
      </CardRow>

      <CardRow>
        <CardLabel><FaCity /> {t('userCard.city')}</CardLabel>
        <CardValue>{user.city || '--'}</CardValue>
      </CardRow>

      <CardRow>
        <CardLabel><FaHome /> {t('userCard.neighborhood')}</CardLabel>
        <CardValue>{user.residentialArea || '--'}</CardValue>
      </CardRow>

      <CardRow>
        <CardLabel><FaShoppingCart /> {t('userCard.responsibility')}</CardLabel>
        <CardValue>{user.purchaseResponsibility || '--'}</CardValue>
      </CardRow>

      <CardRow>
        <CardLabel><FaBaby /> {t('userCard.children')}</CardLabel>
        <CardValue>
          {user.childrenCount || '0'}
          {user.childrenAges && user.childrenAges.length > 0 && (
            <span> ({t('userCard.ages', { ages: user.childrenAges.join(', ') })})</span>
          )}
        </CardValue>
      </CardRow>

      <CardRow>
        <CardLabel><FaGraduationCap /> {t('userCard.education')}</CardLabel>
        <CardValue>{user.educationLevel || '--'}</CardValue>
      </CardRow>

      <CardRow>
        <CardLabel><FaWallet /> {t('userCard.balance')}</CardLabel>
        <CardValue>
          <SuccessBadge>€{user.walletBalance?.toFixed(2) || '0.00'}</SuccessBadge>
        </CardValue>
      </CardRow>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '0.5rem'
      }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.5rem 1rem',
          background: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          <FaUserEdit /> {t('userCard.edit')}
        </button>
      </div>
    </UserCardContainer>
  );
}

export default UserCard;