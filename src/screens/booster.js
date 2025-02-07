import React, { useState } from "react";
import "../App.css";
import FixedLogo from '../components/fixedLogo';
import "../assets/styles/TaskAreaScreen.css"; 
import BoostModal from './../components/BoostModal';
import BottomSpacer from '../components/BottomSpacer';
import ReferralCard from './../components/ReferralCard';

const BoosterScreen = () => {
    // Updated booster data with increased HTC values (500x)
    const boosterData = [
        {
            image: require("../assets/crypto.png"),
            title: "BoostMe",
            text: "3000 $HTC in 8hrs", // Increased from 3000
            buttonText: "Activate me",
            tonPrice: 0.25,
            starPrice: 65,
            htc:50000
        },
        {
            image: require("../assets/crypto.png"),
            title: "GoodVibes",
            text: "70000 $HTC in 8hrs", // Increased from 7000
            buttonText: "Activate me",
            tonPrice: 0.5,
            starPrice: 125,
            htc:100000
        },
        {
            image: require("../assets/crypto.png"),
            title: "D-Entertainer",
            text: "10000 $HTC in 8hrs", // Increased from 10000
            buttonText: "Activate me",
            tonPrice: 1.0,
            starPrice: 250,
            htc:200000
        },
    ];

    // Rest of the component remains the same
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooster, setSelectedBooster] = useState(null);

    const handleModalOpen = (booster) => {
        setSelectedBooster(booster);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedBooster(null);
    };

    return (
        <div className="app">
            <div className="header">
                <button className="back-button">←</button>
                <h1 className="title">Boosters</h1>
            </div>

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

            <div className="referral-section">
                <ReferralCard showHeader={false} />
            </div>

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
