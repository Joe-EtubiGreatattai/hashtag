import React, { useState } from 'react';
import '../App.css';
import Header from '../components/Header';
import AvatarCard from '../components/AvatarCard';
import TimerProgress from '../components/TimerProgress';
import HashtagCard from "../components/HashtagCard";
import BottomSpacer from '../components/BottomSpacer';

const App = () => {
  const [timerKey, setTimerKey] = useState(0);

  const handleClaim = () => {
    // Reset timer by updating its key
    setTimerKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <Header 
        username="slackecy" 
        level="LV 1" 
        profilePhoto="https://via.placeholder.com/50" 
      />
      <HashtagCard 
        hashtag="755670" 
        dailyBonusText="Daily Bonus" 
      />
      <AvatarCard onClaim={handleClaim} />
      <TimerProgress key={timerKey} />
      <BottomSpacer />
    </div>
  );
};

export default App;