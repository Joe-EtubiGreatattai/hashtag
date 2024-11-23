import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './screens/home';
import LeaderboardPage from './screens/LeaderboardPage';
import TaskAreaScreen from './screens/TaskAreaScreen';
import BottomNav from './components/BottomNav';

const Navigation = () => {
  const navigate = useNavigate();
  
  const handleTabClick = (tab) => {
    switch(tab) {
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
      default:
        navigate('/');
    }
  };

  // Get the active tab based on current path
  const getActiveTab = () => {
    const path = window.location.pathname;
    switch(path) {
      case '/':
        return 'home';
      case '/tasks':
        return 'gift';
      case '/leaderboard':
        return 'chart';
      case '/profile':
        return 'user';
      default:
        return 'home';
    }
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tasks" element={<TaskAreaScreen />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile" element={<div>Profile Page (To be implemented)</div>} />
      </Routes>
      <BottomNav activeTab={getActiveTab()} onTabClick={handleTabClick} />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Navigation />
    </Router>
  );
};

export default App;