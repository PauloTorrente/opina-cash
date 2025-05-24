import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegistrationSuccess from './pages/RegistrationSuccess';
import ConditionTerms from './pages/ConditionTerms';
import Survey from './pages/Survey';
import SurveyAccess from './pages/SurveyAccess';
import Results from './pages/Results';
import CreateSurvey from './pages/CreateSurvey'; 
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import styled from 'styled-components';

const MainContent = styled.div`
  padding-top: 80px; 
`;

function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-success/:confirmationToken" element={<RegistrationSuccess />} />
            <Route path="/terms" element={<ConditionTerms />} />
            <Route path="/survey" element={<SurveyAccess />} />

            {/* Rotas protegidas */}
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
                  <Results />
                </PrivateRoute>
              }
            />
            <Route
              path="/results/:surveyId"
              element={
                <PrivateRoute>
                  <Results />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-survey"
              element={
                <PrivateRoute>
                  <CreateSurvey />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute adminOnly={true}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </MainContent>
      </div>
    </AuthProvider>
  );
}

export default App;
