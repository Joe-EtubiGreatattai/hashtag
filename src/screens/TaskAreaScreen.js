import React, { useState } from "react";
import "../App.css";
import ReferralCard from "../components/ReferralCard";
import FixedLogo from '../components/fixedLogo';
import "../assets/styles/TaskAreaScreen.css";
import BottomSpacer from '../components/BottomSpacer';

const TaskAreaScreen = () => {
  const [activeTab, setActiveTab] = useState("Hashtag");

  const tabs = ["Hashtag", "Partners", "Daily Task", "Update"];

  const walletData = {
    Hashtag: [
      { type: "referral" },
      { name: "Connect TON Wallet", hashtags: "49,000 Hashtags", buttonText: 'Go' },
     ],
    Partners: [
      { icon: "₿", name: "BTC", hashtags: "49,000 Hashtags" },
      { icon: "🔴", name: "RubyCoin", hashtags: "49,000 Hashtags" },
    ],
    "Daily Task": [
      {
        type: "video",
        title: "Videos",
        videoUrl: "https://www.youtube.com/embed/s87eOYm3kgM?si=bTkzeSXdpJO7aNnR",
      },
      {
        type: "channel",
        title: "Follow our Artist",
        subtitle: "YouTube channel.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1024px-YouTube_full-color_icon_%282017%29.svg.png",
        url: "https://youtube.com/@hashtagdigital-v3c?si=1R1MuNBEGykblssF",
      },
      {
        type: "card",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiXN9xSEe8unzPBEQOeAKXd9Q55efGHGB9BA&s",
        title: "Follow HashTag on Facebook",
        text: "Reward: +1000 $HTC",
        buttonText: "go",
        url: "https://www.facebook.com/profile.php?id=61567774558192",
      },
      {
        type: "card",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dbOUeCrOBe-mkfGD-fEjQNECJrkromWTYg&s",
        title: "Join our Telegram Channel",
        text: "Reward: +1000 $HTC",
        buttonText: "go",
        url: "https://t.me/hashtagdigitalcreatedomimate",
      },
      {
        type: "card",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP9zXDkNJUki9U8iYi1xQkHhxPDuV-YcP8fQ&s",
        title: "Join our TikTok",
        text: "Reward: +1000 $HTC",
        buttonText: "go",
        url: "https://www.tiktok.com/@hashtag_digital?_t=8r8qct04irQ&_r=1",
      },
      {
        type: "card",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/X_logo.jpg/480px-X_logo.jpg",
        title: "Join our X (Twitter)",
        text: "Reward: +1000 $HTC",
        buttonText: "go",
        url: "https://x.com/HASHTAGDIG74491?t=cKh3b4zEB0ezsmkzMwFbhw&s=09",
      },
      {
        type: "card",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png",
        title: "Join our WhatsApp Channel",
        text: "Reward: +1000 $HTC",
        buttonText: "go",
        url: "https://whatsapp.com/channel/0029Vb1eomuCHDyehw2KnI2z",
      },
    ],
    Update: [
     
     
    ]
  };

  const handleGoButtonClick = (url) => {
    window.open(url, "_blank");
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
        {activeTab === "Hashtag" && (
          <div className="hashtag-section">
            {walletData["Hashtag"].map((item, index) => {
              if (item.type === "referral") {
                return <ReferralCard key={index} />;
              }
              return (
                <div key={index} className="wallet-card">
                  <div className="wallet-details">
                    <div>
                      <p className="wallet-name">{item.name}</p>
                      <p className="wallet-hashtags">{item.hashtags}</p>
                    </div>
                  </div>
                  <button className="go-button">{item.buttonText}</button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "Daily Task" && (
          <div className="daily-task-section">
            <h2 className="title-ii">Videos</h2>
            {/* Updated video section with embedded YouTube iframe */}
            <div className="video-container">
              <iframe 
                width="100%" 
                height="315" 
                src={walletData["Daily Task"][0].videoUrl}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
            </div>

            <div 
              className="youtube-follow"
              onClick={() => handleGoButtonClick(walletData["Daily Task"][1].url)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={walletData["Daily Task"][1].image}
                alt="Follow us"
                className="youtube-image"
              />
              <div className="youtube-text">
                <p>Follow our Artist YouTube channel.</p>
              </div>
            </div>

            <div className="task-cards">
              {walletData["Daily Task"].slice(2).map((task, index) => (
                <div key={index} className="task-card">
                  <img src={task.image} alt={task.title} className="task-image" />
                  <div className="task-text">
                    <h3>{task.title}</h3>
                    <p>{task.text}</p>
                  </div>
                  <button className="task-button" onClick={() => handleGoButtonClick(task.url)}>
                    {task.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Partners" && (
          <div className="wallet-section">
            <h2 className="title-ii">Wallets</h2>
            {walletData["Partners"].map((wallet, index) => (
              <div key={index} className="wallet-card">
                <div className="wallet-details-2">
                  <span className="wallet-icon">{wallet.icon}</span>
                  <div>
                    <p className="wallet-name">{wallet.name}</p>
                    <p className="wallet-hashtags">{wallet.hashtags}</p>
                  </div>
                  <button className="go-button">GO</button>
                </div>
              </div>
            ))}
            <button className="buy-button">Buy $HTC</button>
          </div>
        )}

        {activeTab === "Update" && (
          <div className="update-section">
            <h2 className="title-ii">Wallets</h2>
            {walletData.Update.map((update, index) => (
              <div key={index} className="wallet-card">
                  <img src={update.image} alt={update.title} className="booster-icon" />
                <div className="wallet-details">
                  <h3 className="wallet-name">{update.title}</h3>
                  <p className="wallet-hashtags">{update.content}</p>
                </div>
                <button className="go-button">{update.buttonText}</button>
              </div>
            ))}
            <ReferralCard />
          </div>
        )}
      </div>

      <BottomSpacer />
    </div>
  );
};

export default TaskAreaScreen;