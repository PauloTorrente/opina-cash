import { 
  FaUserShield, FaEnvelope, FaCheckCircle, FaTimesCircle, 
  FaCalendarAlt, FaVenusMars, FaBirthdayCake, FaPhone, 
  FaCity, FaHome, FaShoppingCart, FaBaby, 
  FaGraduationCap, FaWallet, FaUserEdit 
} from 'react-icons/fa';
import styled from 'styled-components';

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

const formatDate = (dateString) => {
  if (!dateString) return 'No disponible';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

function UserCard({ user }) {
  return (
    <UserCardContainer 
      isAdmin={user.role === 'admin'}
      isConfirmed={user.isConfirmed}
    >
      <CardRow>
        <CardLabel><FaUserShield /> ID:</CardLabel>
        <CardValue>{user.id}</CardValue>
      </CardRow>
      
      <CardRow>
        <CardLabel><FaUserShield /> Nombre:</CardLabel>
        <CardValue>
          {`${user.firstName} ${user.lastName}`}
          {user.role === 'admin' ? (
            <DangerBadge><FaUserShield /> Admin</DangerBadge>
          ) : (
            <InfoBadge><FaUserShield /> {user.role}</InfoBadge>
          )}
        </CardValue>
      </CardRow>
      
      <CardRow>
        <CardLabel><FaEnvelope /> Email:</CardLabel>
        <CardValue>{user.email}</CardValue>
      </CardRow>
      
      <CardRow>
        <CardLabel><FaCheckCircle /> Estado:</CardLabel>
        <CardValue>
          {user.isConfirmed ? (
            <SuccessBadge><FaCheckCircle /> Confirmado</SuccessBadge>
          ) : (
            <WarningBadge><FaTimesCircle /> No confirmado</WarningBadge>
          )}
        </CardValue>
      </CardRow>
      
      <CardRow>
        <CardLabel><FaCalendarAlt /> Registro:</CardLabel>
        <CardValue>{formatDate(user.createdAt)}</CardValue>
      </CardRow>
      
      <CardRow>
        <CardLabel><FaVenusMars /> Género:</CardLabel>
        <CardValue>{user.gender || 'No especificado'}</CardValue>
      </CardRow>
      
      <CardRow>
        <CardLabel><FaBirthdayCake /> Edad:</CardLabel>
        <CardValue>{user.age || '--'}</CardValue>
      </CardRow>
      
      <CardRow>
        <CardLabel><FaPhone /> Teléfono:</CardLabel>
        <CardValue>{user.phone_number || '--'}</CardValue>
      </CardRow>
      
      <CardRow>
        <CardLabel><FaCity /> Ciudad:</CardLabel>
        <CardValue>{user.city || '--'}</CardValue>
      </CardRow>
      
      <CardRow>
        <CardLabel><FaHome /> Barrio:</CardLabel>
        <CardValue>{user.residentialArea || '--'}</CardValue>
      </CardRow>
      
      <CardRow>
        <CardLabel><FaShoppingCart /> Responsabilidad:</CardLabel>
        <CardValue>{user.purchaseResponsibility || '--'}</CardValue>
      </CardRow>
      
      <CardRow>
        <CardLabel><FaBaby /> Hijos:</CardLabel>
        <CardValue>
          {user.childrenCount || '0'}
          {user.childrenAges && user.childrenAges.length > 0 && (
            <span> (Edades: {user.childrenAges.join(', ')})</span>
          )}
        </CardValue>
      </CardRow>
      
      <CardRow>
        <CardLabel><FaGraduationCap /> Educación:</CardLabel>
        <CardValue>{user.educationLevel || '--'}</CardValue>
      </CardRow>
      
      <CardRow>
        <CardLabel><FaWallet /> Saldo:</CardLabel>
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
          <FaUserEdit /> Editar
        </button>
      </div>
    </UserCardContainer>
  );
}

export default UserCard;