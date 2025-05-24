import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SuperSimpleContainer } from '../components/ContainerAnimated';
import FilterPanel from '../components/FilterPanel';
import TitleHeader from '../components/TitleHeader';
import SearchControls from '../components/SearchControls';
import ContentSwitcher from '../components/ContentSwitcher';
import UsersFilter from '../components/UsersFilter';
import HtmlDownloader from '../components/HtmlDownloader';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    role: '',
    hasChildren: '',
    minBalance: '',
    maxBalance: '',
    gender: '',
    purchaseResponsibility: '',
    educationLevel: ''
  });
  
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const dashboardRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authFetch('/users');
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || '¡Ups! Algo salió mal al cargar los usuarios');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.role?.toLowerCase() === 'admin') {
      fetchUsers();
    } else {
      navigate('/');
    }
  }, [user, navigate, authFetch]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName] === value ? '' : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      role: '',
      hasChildren: '',
      minBalance: '',
      maxBalance: '',
      gender: '',
      purchaseResponsibility: '',
      educationLevel: ''
    });
    setSearchTerm('');
  };

  const filteredUsers = UsersFilter({ users, filters, searchTerm });

  const hasActiveFilters = Object.values(filters).some(val => val !== '') || searchTerm !== '';

  const getHtmlContent = () => {
    if (!dashboardRef.current) return '';
    
    // Cria um clone limpo do conteúdo
    const clone = dashboardRef.current.cloneNode(true);
    
    // Remove elementos interativos
    const elementsToRemove = clone.querySelectorAll(
      'button, input, select, textarea, .no-export'
    );
    elementsToRemove.forEach(el => el.remove());
    
    // Adiciona metadados e estilos básicos
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório do Dashboard - ${new Date().toLocaleDateString()}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .container { max-width: 1200px; margin: 0 auto; }
          .header { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .filters-info { margin: 15px 0; padding: 10px; background: #f8f8f8; }
          .timestamp { text-align: right; font-size: 0.9em; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Relatório de Usuários</h1>
            <div class="filters-info">
              <strong>Filtros aplicados:</strong> 
              ${hasActiveFilters ? Object.entries(filters).filter(([_, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ') : 'Nenhum'}
              ${searchTerm ? `, Pesquisa: "${searchTerm}"` : ''}
            </div>
          </div>
          ${clone.innerHTML}
          <div class="timestamp">
            Gerado em: ${new Date().toLocaleString()}
          </div>
        </div>
      </body>
      </html>
    `;
  };

  if (!user || user.role.toLowerCase() !== 'admin') {
    return null;
  }

  return (
    <SuperSimpleContainer ref={dashboardRef}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <TitleHeader />
        <HtmlDownloader 
          content={getHtmlContent()} 
          disabled={loading}
        />
      </div>
      
      <SearchControls 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onFilterToggle={() => setShowFilters(!showFilters)}
        isFilterActive={showFilters || hasActiveFilters}
      />
      
      {showFilters && (
        <FilterPanel
          filters={filters}
          searchTerm={searchTerm}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
          setSearchTerm={setSearchTerm}
        />
      )}
      
      <ContentSwitcher
        loading={loading}
        error={error}
        filteredUsers={filteredUsers}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
        totalCount={users.length}
      />
    </SuperSimpleContainer>
  );
}

export default Dashboard;