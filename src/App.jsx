import { Routes, Route } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/register';
import RegisterDetail from './pages/registerDetail'; 
import './App.css';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-detail" element={<RegisterDetail />} /> 
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </div>
  );
}

export default App;
