import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

const API_BASE = 'http://localhost:8000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLightMode, setIsLightMode] = useState(localStorage.getItem('theme') === 'light');
  const [activeStandard, setActiveStandard] = useState('Global WHO Standard');
  const [populationData, setPopulationData] = useState(null);
  const [userResults, setUserResults] = useState(null);
  const [metrics, setMetrics] = useState({
    gender: 'Male',
    age: 20,
    weight: 84,
    height: 190,
    hip_cm: 92
  });

  const fetchPopulationData = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE}/data`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPopulationData(response.data);
    } catch (error) {
      console.error('Error fetching population data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const calculateMetrics = async (currentMetrics, currentStandard) => {
    if (!token) return;
    try {
      const response = await axios.post(`${API_BASE}/calculate`, {
        ...currentMetrics,
        active_standard: currentStandard
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserResults(response.data);
    } catch (error) {
      console.error('Error calculating metrics:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setPopulationData(null);
    setUserResults(null);
  };

  useEffect(() => {
    if (token) {
      fetchPopulationData();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      calculateMetrics(metrics, activeStandard);
    }
  }, [metrics, activeStandard, token]);

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    localStorage.setItem('theme', newMode ? 'light' : 'dark');
  };

  if (!token) {
    return (
      <div className={isLightMode ? 'light' : ''}>
        <Login onLoginSuccess={(t) => setToken(t)} />
      </div>
    );
  }

  return (
    <div className={`flex h-screen bg-bg-main overflow-hidden font-sans transition-colors duration-500 ${isLightMode ? 'light' : ''}`}>
      <Sidebar
        metrics={metrics}
        setMetrics={setMetrics}
        results={userResults}
        activeStandard={activeStandard}
        setActiveStandard={setActiveStandard}
      />

      <main className="flex-1 overflow-y-auto custom-scrollbar bg-bg-main">
        {populationData && (
          <Dashboard
            data={populationData}
            userResults={userResults}
            userMetrics={metrics}
            onLogout={handleLogout}
            isLightMode={isLightMode}
            toggleTheme={toggleTheme}
            activeStandard={activeStandard}
          />
        )}
      </main>
    </div>
  );
}

export default App;