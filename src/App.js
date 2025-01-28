import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomePage from './screens/home';
import LoadingScreen from './screens/loading';
import LeaderboardPage from './screens/LeaderboardPage';
import Booster from './screens/booster';  // Import Booster page
import TaskAreaScreen from './screens/TaskAreaScreen';
import BottomNav from './components/BottomNav';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle tab clicks
  const handleTabClick = (tab) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'gift':
        navigate('/tasks');
        break;
      case 'chart':
        navigate('/leaderboard');
        break;
      case 'user':
        navigate('/profile');
        break;
      case 'friend':
        navigate('/friends');
        break;
      case 'booster':  // Add booster navigation case
        navigate('/booster');
        break;
      default:
        navigate('/');
    }
  };

  // Get the active tab based on the current path
  const getActiveTab = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'home';
      case '/tasks':
        return 'gift';
      case '/leaderboard':
        return 'chart';
      case '/profile':
        return 'user';
      case '/friends':
        return 'friend';
      case '/booster':  // Add booster tab check
        return 'booster';
      default:
        return 'home';
    }
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<TaskAreaScreen />} />
        <Route path="/tasks" element={<HomePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile" element={<div>Profile Page (To be implemented)</div>} />
        <Route path="/friends" element={<div>Friends Page (To be implemented)</div>} />
        <Route path="/booster" element={<Booster />} />  {/* Add Booster Route */}
      </Routes>
      <BottomNav activeTab={getActiveTab()} onTabClick={handleTabClick} />
    </div>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // After 3 seconds, set loading to false
    }, 3000); // Adjust this time as needed
  }, []);

  return (
    <Router>
      {loading ? <LoadingScreen /> : <Navigation />} {/* Show loading screen first */}
    </Router>
  );
};

export default App;
