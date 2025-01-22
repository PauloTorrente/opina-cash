import { Routes, Route } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterDetail from './pages/RegisterDetail'; 
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
// update
export default App;
