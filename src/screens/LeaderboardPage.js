import React, { useState } from "react";
import Header from "../components/Header";
import "../App.css";
import Leaderboard from "../components/Leaderboard";
import "../assets/styles/LeaderboardPage.css";  // Import the new CSS file
import BottomSpacer from '../components/BottomSpacer';

const LeaderboardPage = () => {
  const leaderboardData = [
    {
      rank: 1,
      username: "Obed Rich",
      hashtags: 79_899_999,
      image: require('../assets/user.png'),
    },
    {
      rank: 2,
      username: "JK",
      hashtags: 62_142_521,
      image: require('../assets/user3.png'),
    },
    {
      rank: 3,
      username: "My guy",
      hashtags: 80_001_146,
      image: require('../assets/user4.png'),
    },
  ];


  return (
    <>
      <div className="app">
        <Header
          username="slackecy"
          level="LV 1"
          profilePhoto="https://via.placeholder.com/50"
        />
        <Leaderboard/>
        <div className="leaderboard-container">
        <div className="holder">
          <div className="leaderboard-title">Total</div>
          <div className="leaderboard-title">40,123,000 users</div>
        </div>
          <div className="leaderboard-list">
            {leaderboardData.map((user, index) => (
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
                    <div className="hashtags">{user.hashtags.toLocaleString()} Hashtags</div>
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
