import React from "react";
import "../App.css";
import "../assets/styles/TaskAreaScreen.css";
import BottomSpacer from '../components/BottomSpacer';
import ReferralComponent from "../components/referalButton";

const FriendScreen = () => {
  return (
    <div className="app">
      <div className="header">
        <button className="back-button">←</button>
        <h1 className="title">Friends</h1>
      </div>

      <img src={require('../assets/logo-big.png')} alt='' className="friend-logo" />
      <h2 className="friend-title">Invite friends!</h2>
      <p className="friend-sub">You and your friend will receive</p>

      <div className="button-container">
        <button className="price-button">+1000 $HTC</button>
        <button className="price-button">+10K $HTC with Telegram Premium</button>
      </div>

      <ReferralComponent />

      <p className="friend-bottom">
        Every invite increases your $HTC points, making you ahead on the leaderboard. More invites, more TGE rewards.
      </p>

      <BottomSpacer />
    </div>
  );
};

export default FriendScreen;
