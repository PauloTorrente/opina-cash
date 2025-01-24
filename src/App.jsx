import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterDetail from './pages/RegisterDetail';
import RegistrationSuccess from './pages/RegistrationSuccess';
import ConditionTerms from './pages/ConditionTerms';  


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-detail" element={<RegisterDetail />} />
        <Route path="/register-success/:confirmationToken" element={<RegistrationSuccess />} />
        <Route path="/terms" element={<ConditionTerms />} /> 
      </Routes>
    </div>
  );
}

export default App;
