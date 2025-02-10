import React, { useState, useEffect } from "react";
import "../App.css";
import ReferralCard from "../components/ReferralCard";
import FixedLogo from '../components/fixedLogo';
import "../assets/styles/TaskAreaScreen.css";
import BottomSpacer from '../components/BottomSpacer';
import { getAuthToken } from '../config';
import placeholderImage from '../assets/user.png';

const TaskAreaScreen = () => {
  const [activeTab, setActiveTab] = useState("Hashtag");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("completedTasks")) || {};
  });

  const tabs = ["Hashtag", "Partners", "Daily Task", "Update"];

  useEffect(() => {
    if (activeTab === "Daily Task") {
      fetchTasks();
    }
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [completedTasks]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const response = await fetch('https://api.hashtagdigital.net/api/fetch-tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data.task);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoButtonClick = (taskId, url) => {
    window.open(url, "_blank");
    setCompletedTasks(prev => ({ ...prev, [taskId]: "" }));
  };

  const handleCodeSubmit = (taskId) => {
    console.log(`Code submitted for task ${taskId}:`, completedTasks[taskId]);
  };

  const renderDailyTaskSection = () => {
    if (loading) {
      return <div className="loading">Loading tasks...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    return (
      <div className="daily-task-section" style={{ alignItems: 'flex-start' }}>
        <h2 className="title-ii">Daily Tasks</h2>
        <div className="task-cards" style={{ justifyContent: 'flex-start' }}>
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <img src={placeholderImage} alt="Task" className="task-image" />
              <div className="task-text">
                <h3>{task.name}</h3>
                <p className="task-reward">Reward: +{task.reward} $HTC</p>
              </div>
              <button 
                className="task-button" 
                onClick={() => handleGoButtonClick(task.id, task.link)}
              >
                GO
              </button>
              {completedTasks[task.id] !== undefined && (
                <div className="verification-section">
                  <input 
                    type="text" 
                    placeholder="Enter verification code" 
                    value={completedTasks[task.id]} 
                    onChange={(e) => setCompletedTasks(prev => ({ ...prev, [task.id]: e.target.value }))}
                  />
                  <button onClick={() => handleCodeSubmit(task.id)}>Submit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <FixedLogo />
      <div className="header">
        <button className="back-button">←</button>
        <h1 className="title">{activeTab}</h1>
      </div>

      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab ${activeTab === tab ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="content">
        {activeTab === "Daily Task" && renderDailyTaskSection()}
      </div>

      <BottomSpacer />
    </div>
  );
};

export default TaskAreaScreen;