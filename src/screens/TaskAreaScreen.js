import React, { useState } from "react";
import "../App.css";
import ReferralCard from "../components/ReferralCard";
import GamifySystemCard from "../components/GamifySystemCard";
import "../assets/styles/TaskAreaScreen.css"; // Import TaskAreaScreen-specific CSS
import BottomSpacer from '../components/BottomSpacer';

const TaskAreaScreen = () => {
  const [activeTab, setActiveTab] = useState("Hashtag");

  const tabs = ["Hashtag", "Partners", "Daily Task"];

  const walletData = {
    Hashtag: [
      { icon: "💎", name: "Connect TON Wallet", hashtags: "49,000 Hashtags" },
      { icon: "🐕", name: "Connect Doge Wallet", hashtags: "49,000 Hashtags" },
      { type: "tonic" },
      { type: "referral" },
    ],
    Partners: [
      { icon: "₿", name: "BTC", hashtags: "49,000 Hashtags" },
      { icon: "🔴", name: "RubyCoin", hashtags: "49,000 Hashtags" },
    ],
    "Daily Task": [
      {
        type: "video",
        title: "Videos",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Example video
      },
      {
        type: "channel",
        title: "Follow our Artist",
        subtitle: "YouTube channel.",
        image: "https://via.placeholder.com/40", // Example image
      },
    ],
  };

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <button className="back-button">←</button>
        <h1 className="title">Task Area</h1>
      </div>

      {/* Tabs */}
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

      {/* Content */}
      <div className="content">
        {activeTab === "Hashtag" && (
          <div className="hashtag-section">
            {walletData["Hashtag"].map((item, index) => {
              if (item.type === "tonic") {
                return <GamifySystemCard />;
              }
              if (item.type === "referral") {
                return <ReferralCard />;
              }
              return (
                <div key={index} className="wallet-card">
                  <div className="wallet-details">
                    <span className="wallet-icon">{item.icon}</span>
                    <div>
                      <p className="wallet-name">{item.name}</p>
                      <p className="wallet-hashtags">{item.hashtags}</p>
                    </div>
                  </div>
                  <button className="go-button">GO</button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "Daily Task" && (
          <div className="daily-task-section">
            {/* Video Section */}
            <h2>Videos</h2>
            <video className="daily-task-video" controls>
              <source
                src={walletData["Daily Task"][0].videoUrl}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            {/* YouTube Follow Section */}
            <div className="youtube-follow">
              <img
                src={walletData["Daily Task"][1].image}
                alt="Follow us"
                className="youtube-image"
              />
              <div className="youtube-text">
                <p>Follow our Artist YouTube channel.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Partners" && (
          <div className="wallet-section">
            <h2>Wallets</h2>
            {walletData["Partners"].map((wallet, index) => (
              <div key={index} className="wallet-card">
                <div className="wallet-details">
                  <span className="wallet-icon">{wallet.icon}</span>
                  <div>
                    <p className="wallet-name">{wallet.name}</p>
                    <p className="wallet-hashtags">{wallet.hashtags}</p>
                  </div>
                </div>
                <button className="go-button">GO</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomSpacer />
      </div>
  );
};

export default TaskAreaScreen;
