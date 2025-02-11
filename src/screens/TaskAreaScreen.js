import React, { useState, useEffect } from "react";
import "../App.css";
import FixedLogo from '../components/fixedLogo';
import "../assets/styles/TaskAreaScreen.css";
import BottomSpacer from '../components/BottomSpacer';
import { getAuthToken } from '../config';
import placeholderImage from '../assets/logo-2.png';

const TaskAreaScreen = () => {
  const [activeTab, setActiveTab] = useState("Hashtag/Update");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [verificationInputs, setVerificationInputs] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState({});

  const tabs = ["Hashtag/Update", "Partners", "Daily Task"];

  useEffect(() => {
    if (activeTab === "Daily Task") {
      fetchTasks();
      fetchCompletedTasks();
    }
  }, [activeTab]);

  const fetchCompletedTasks = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('https://api.hashtagdigital.net/api/fetch-completed-task', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch completed tasks');
      }
      const data = await response.json();
      setCompletedTasks(data.completedTask || []);
    } catch (err) {
      console.error('Error fetching completed tasks:', err);
    }
  };

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
  };

  const handleCodeSubmit = async (taskId) => {
    const code = verificationInputs[taskId];
    if (!code) return;

    setSubmissionStatus(prev => ({ ...prev, [taskId]: 'submitting' }));

    try {
      const token = getAuthToken();
      const response = await fetch('https://api.hashtagdigital.net/api/complete-task', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskID: taskId.toString(),
          code: code
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSubmissionStatus(prev => ({ ...prev, [taskId]: 'success' }));
        setVerificationInputs(prev => ({ ...prev, [taskId]: '' }));
        fetchCompletedTasks();
      } else {
        setSubmissionStatus(prev => ({ ...prev, [taskId]: 'error' }));
      }
    } catch (err) {
      setSubmissionStatus(prev => ({ ...prev, [taskId]: 'error' }));
    }
  };

  const isTaskCompleted = (taskId) => {
    return completedTasks.some(task => task.taskID === taskId);
  };

  const renderDailyTaskSection = () => {
    if (loading) {
      return <div className="loading">Loading tasks...</div>;
    }
    if (error) {
      return <div className="error">Error: {error}</div>;
    }
    return (
      <div className="daily-task-section">
        <div className="task-cards">
          {tasks.map((task) => {
            const taskCompleted = isTaskCompleted(task.id);
            const status = submissionStatus[task.id];
            return (
              <div key={task.id} className={`task-container ${taskCompleted ? 'completed' : ''}`}>
                <div className="task-card">
                  <img src={placeholderImage} alt="Task" className="task-image" />
                  <div className="task-text">
                    <h3>{task.name}</h3>
                    <p className="task-reward">Reward: +{task.reward} $HTC</p>
                  </div>
                  {!taskCompleted && (
                    <button className="task-button" onClick={() => handleGoButtonClick(task.id, task.link)}>GO</button>
                  )}
                  {taskCompleted && <div className="completed-badge">✓</div>}
                </div>
                {!taskCompleted && (
                  <div className="verification-section">
                    <input type="text" className={`verification-input ${status === 'error' ? 'error' : ''}`} placeholder="Enter verification code" value={verificationInputs[task.id] || ''} onChange={(e) => setVerificationInputs(prev => ({ ...prev, [task.id]: e.target.value }))} />
                    <button className={`verification-button ${status === 'submitting' ? 'submitting' : ''}`} onClick={() => handleCodeSubmit(task.id)} disabled={status === 'submitting'}>
                      {status === 'submitting' ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
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
          <button key={tab} onClick={() => setActiveTab(tab)} className={`tab ${activeTab === tab ? "active" : ""}`}>{tab}</button>
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
