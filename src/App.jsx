import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterDetail from './pages/RegisterDetail';
import RegistrationSuccess from './pages/RegistrationSuccess';
import ConditionTerms from './pages/ConditionTerms';
import Survey from './pages/Survey';
import SurveyAccess from './pages/SurveyAccess';
import Results from './pages/Results'; // Componente unificado
import Navbar from './components/Navbar';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-detail" element={<RegisterDetail />} />
          <Route path="/register-success/:confirmationToken" element={<RegistrationSuccess />} />
          <Route path="/terms" element={<ConditionTerms />} />
          <Route path="/survey" element={<SurveyAccess />} />

          {/* Protected routes */}
          <Route
            path="/survey/respond"
            element={
              <PrivateRoute>
                <Survey />
              </PrivateRoute>
            }
          />
          <Route
            path="/results"
            element={
              <PrivateRoute>
                <Results /> {/* Lista de enquetes */}
              </PrivateRoute>
            }
          />
          <Route
            path="/results/:surveyId"
            element={
              <PrivateRoute>
                <Results /> {/* Detalhes da enquete */}
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
