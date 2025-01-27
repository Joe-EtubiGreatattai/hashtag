import React, { useState } from "react";
import "../App.css";
import FixedLogo from '../components/fixedLogo';
import "../assets/styles/TaskAreaScreen.css"; 
import RewardModal from './../components/BoostModal';
import BottomSpacer from '../components/BottomSpacer';

const BoosterScreen = () => {
    // Sample list data for boosters with image paths
    const boosterData = [
        {
            image: "path_to_image/double_points.png",  // Replace with actual image path
            title: "Double Points",
            text: "3000 $HTC in 8hrs",
            buttonText: "Activate me"
        },
        {
            image: "path_to_image/speed_boost.png",  // Replace with actual image path
            title: "Speed Boost",
            text: "3000 $HTC in 8hrs",
            buttonText: "Activate me"
        },
        {
            image: "path_to_image/hot_streak.png",  // Replace with actual image path
            title: "Hot Streak",
            text: "3000 $HTC in 8hrs",
            buttonText: "Activate me"
        },
        {
            image: "path_to_image/hot_streak.png",  // Replace with actual image path
            title: "Hot Streak",
            text: "3000 $HTC in 8hrs",
            buttonText: "Activate me"
        },
        {
            image: "path_to_image/hot_streak.png",  // Replace with actual image path
            title: "Hot Streak",
            text: "3000 $HTC in 8hrs",
            buttonText: "Activate me"
        },
        {
            image: "path_to_image/hot_streak.png",  // Replace with actual image path
            title: "Hot Streak",
            text: "3000 $HTC in 8hrs",
            buttonText: "Activate me"
        },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle modal opening
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    // Handle modal closing
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="app">
            <FixedLogo />
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
                        <button className="booster-button" onClick={handleModalOpen}>
                            {booster.buttonText}
                        </button>
                    </div>
                ))}
            </div>

            {/* Reward Modal */}
            {isModalOpen && <RewardModal onClose={handleModalClose} />}

            <BottomSpacer />
        </div>
    );
};

export default BoosterScreen;
