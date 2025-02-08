import React, { useState, useEffect } from "react";
import Header from "../components/header2";
import "../App.css";
import Leaderboard from "../components/Leaderboard";
import "../assets/styles/LeaderboardPage.css";
import BottomSpacer from '../components/BottomSpacer';
import { getAuthToken } from '../config';

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

  // Fetch rankings and total user count
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        
        // Fetch rankings and total users count in parallel
        const [rankingsResponse, totalUsersResponse] = await Promise.all([
          fetch('https://api.hashtagdigital.net/api/global', {
            headers
          }),
          fetch('https://api.hashtagdigital.net/api/leader-count', {
            headers
          })
        ]);

        if (!rankingsResponse.ok || !totalUsersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const rankingsData = await rankingsResponse.json();
        const totalUsersData = await totalUsersResponse.json();
        
        // Sort rankings by htcWalletBalance in descending order and add rank
        const sortedRankings = rankingsData.rankings
          .sort((a, b) => b.htcWalletBalance - a.htcWalletBalance)
          .map((user, index) => ({
            ...user,
            rank: index + 1
          }))
          .slice(0, 3); // Get top 3 users

        setRankings(sortedRankings);
        setTotalUsers(totalUsersData.count);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
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
    score: user.htcWalletBalance.toLocaleString(),
    position: user.rank === 1 ? 'center' : user.rank === 2 ? 'left' : 'right',
    image: user.photoURL || require('../assets/user.png')
  }));

  // Transform rankings data for the list view
  const listData = rankings.map(user => ({
    rank: user.rank,
    username: user.username,
    hashtags: user.htcWalletBalance,
    image: user.photoURL || require('../assets/user.png')
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