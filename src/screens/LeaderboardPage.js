import React, { useState, useEffect } from "react";
import Header from "../components/header2";
import "../App.css";
import Leaderboard from "../components/Leaderboard";
import "../assets/styles/LeaderboardPage.css";
import BottomSpacer from '../components/BottomSpacer';

const LeaderboardPage = () => {
  const [rankings, setRankings] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from localStorage or Telegram WebApp
  useEffect(() => {
    const fetchUserData = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData({
          username: user.username || `${user.first_name} ${user.last_name || ''}`.trim(),
          photo_url: user.photo_url || "https://via.placeholder.com/50"
        });
      } else if (window.Telegram?.WebApp) {
        const webAppUser = window.Telegram.WebApp.initDataUnsafe?.user;
        if (webAppUser) {
          setUserData({
            username: webAppUser.username || `${webAppUser.first_name} ${webAppUser.last_name || ''}`.trim(),
            photo_url: webAppUser.photo_url || "https://via.placeholder.com/50"
          });
        }
      }
    };

    fetchUserData();
  }, []);

  // Fetch rankings data
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.hashtagdigital.net/api/global');
        if (!response.ok) {
          throw new Error('Failed to fetch rankings');
        }
        const data = await response.json();
        
        // Sort rankings by stars in descending order and add rank
        const sortedRankings = data.rankings
          .sort((a, b) => b.stars - a.stars)
          .map((user, index) => ({
            ...user,
            rank: index + 1
          }))
          .slice(0, 3); // Get top 3 users

        setRankings(sortedRankings);
        setTotalUsers(data.rankings.length);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return (
      <div className="appIII">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appIII">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  // Transform rankings data for the Leaderboard component
  const leaderboardData = rankings.map(user => ({
    id: user.rank,
    name: user.username,
    score: user.stars.toLocaleString(),
    position: user.rank === 1 ? 'center' : user.rank === 2 ? 'left' : 'right',
    image: require('../assets/user.png') // You can map different images based on rank if needed
  }));

  // Transform rankings data for the list view
  const listData = rankings.map(user => ({
    rank: user.rank,
    username: user.username,
    hashtags: user.stars,
    image: require('../assets/user.png') // You can map different images based on rank if needed
  }));

  return (
    <>
      <div className="appIII">
        {userData && (
          <Header
            username={userData.username}
            level="LV 1"
            profilePhoto={userData.photo_url}
          />
        )}
        <Leaderboard data={leaderboardData} />
        <div className="leaderboard-container">
          <div className="holder">
            <div className="leaderboard-title">Total</div>
            <div className="leaderboard-title">{totalUsers.toLocaleString()} users</div>
          </div>
          <div className="leaderboard-list">
            {listData.map((user, index) => (
              <div key={index} className="leaderboard-item">
                <div className="leaderboard-item-info">
                  <div className="user-avatar">
                    <img
                      className="avatar-image"
                      src={user.image}
                      alt={user.username}
                    />
                  </div>
                  <div className="user-details">
                    <div className="username">{user.username}</div>
                    <div className="hashtags">{user.hashtags.toLocaleString()} HTC</div>
                  </div>
                </div>
                <span className="user-rank">#{user.rank}</span>
              </div>
            ))}
          </div>
        </div>
        <BottomSpacer />
      </div>
    </>
  );
};

export default LeaderboardPage;