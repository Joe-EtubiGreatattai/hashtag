import React, { useState } from "react";
import "../App.css";
import FixedLogo from '../components/fixedLogo';
import "../assets/styles/TaskAreaScreen.css"; 
import BoostModal from './../components/BoostModal';
import BottomSpacer from '../components/BottomSpacer';
import ReferralCard from './../components/ReferralCard';

const BoosterScreen = () => {
    // Sample list data for boosters with image paths
    const boosterData = [
        {
            image: require("../assets/crypto.png"),
            title: "Double Points",
            text: "3000 $HTC in 8hrs",
            buttonText: "Activate me"
        },
        {
            image: require("../assets/crypto.png"),
            title: "Speed Boost",
            text: "3000 $HTC in 8hrs",
            buttonText: "Activate me"
        },
        {
            image: require("../assets/crypto.png"),
            title: "Hot Streak",
            text: "3000 $HTC in 8hrs",
            buttonText: "Activate me"
        },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooster, setSelectedBooster] = useState(null);

    // Handle modal opening
    const handleModalOpen = (booster) => {
        setSelectedBooster(booster);
        setIsModalOpen(true);
    };

    // Handle modal closing
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedBooster(null);
    };

    return (
        <div className="app">
            {/* Header */}
            <div className="header">
                <button className="back-button">←</button>
                <h1 className="title">Boosters</h1>
            </div>

            {/* Booster Cards */}
            <div className="booster-cards-container">
                <h2 className="booster-title-header">Boost To Earn More Points</h2>
                {boosterData.map((booster, index) => (
                    <div key={index} className="booster-card">
                        <img src={booster.image} alt={booster.title} className="booster-icon" />
                        <div className="booster-card-header">
                            <h3 className="booster-title">{booster.title}</h3>
                            <p className="booster-text">{booster.text}</p>
                        </div>
                        <button className="booster-button" onClick={() => handleModalOpen(booster)}>
                            {booster.buttonText}
                        </button>
                    </div>
                ))}
            </div>

            {/* Add ReferralCard component */}
            <div className="referral-section">
                <ReferralCard showHeader={false} />
            </div>

            {/* Reward Modal */}
            {isModalOpen && (
                <BoostModal
                    onClose={handleModalClose}
                    booster={selectedBooster}
                />
            )}

            <BottomSpacer />
        </div>
    );
};

export default BoosterScreen;