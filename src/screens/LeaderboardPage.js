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

  const truncateUsername = (username) => {
    return username.length > 6 ? `${username.substring(0, 6)}...` : username;
  };

  // Fetch user data from localStorage or Telegram WebApp
  useEffect(() => {
    const fetchUserData = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData({
          username: truncateUsername(user.username || `${user.first_name} ${user.last_name || ''}`.trim()),
          photo_url: user.photo_url || "https://via.placeholder.com/50"
        });
      } else if (window.Telegram?.WebApp) {
        const webAppUser = window.Telegram.WebApp.initDataUnsafe?.user;
        if (webAppUser) {
          setUserData({
            username: truncateUsername(webAppUser.username || `${webAppUser.first_name} ${webAppUser.last_name || ''}`.trim()),
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
        
        if (!token) {
          throw new Error('No authentication token found');
        }

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

        if (!rankingsData.rankings) {
          throw new Error('Invalid rankings data structure');
        }
        
        // Sort rankings by htcWalletBalance in descending order and add rank
        const sortedRankings = rankingsData.rankings
          .sort((a, b) => b.htcWalletBalance - a.htcWalletBalance)
          .map((user, index) => ({
            ...user,
            username: truncateUsername(user.username),
            rank: index + 1
          }))
          .slice(0, 200); // Get top 200 users

        setRankings(sortedRankings);
        setTotalUsers(totalUsersData.userCount);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
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

  // Transform top 3 rankings data for the Leaderboard component
  const leaderboardData = rankings.slice(0, 3).map(user => ({
    id: user.rank,
    name: user.username,
    score: user.htcWalletBalance.toLocaleString(),
    position: user.rank === 1 ? 'center' : user.rank === 2 ? 'left' : 'right',
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
            {rankings.map((user, index) => (
              <div key={index} className="leaderboard-item">
                <div className="leaderboard-item-info">
                  <div className="user-avatar">
                    <img
                      className="avatar-image"
                      src={user.photoURL || require('../assets/user.png')}
                      alt={user.username}
                    />
                  </div>
                  <div className="user-details">
                    <div className="username">{user.username}</div>
                    <div className="hashtags">{user.htcWalletBalance.toLocaleString()} HTC</div>
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