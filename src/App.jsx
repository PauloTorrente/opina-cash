import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegistrationSuccess from './pages/auth/RegistrationSuccess';
import ConditionTerms from './pages/auth/ConditionTerms';
import Survey from './pages/survey/Survey';
import SurveyAccess from './pages/survey/SurveyAccess';
import Results from './pages/results/Results';
import CreateSurvey from './pages/survey/CreateSurvey'; 
import Profile from './pages/profile/Profile';
import Dashboard from './pages/dashboard/Dashboard';
import Navbar from './components/layout/navbar/Navbar';
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
