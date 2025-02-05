import React, { useState, useEffect } from 'react';
import './../assets/styles/loading.css';
import logo from '../assets/logo.png';
import video from '../assets/background.mp4';

function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      <video autoPlay muted loop className="video-background">
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <img src={logo} alt="HashTag Logo" className="logo" />
       
         
      </div>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  );
}

export default LoadingScreen;