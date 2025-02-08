import React, { useState, useEffect } from "react";
import "../App.css";
import FixedLogo from '../components/fixedLogo';
import "../assets/styles/TaskAreaScreen.css"; 
import BoostModal from './../components/BoostModal';
import BottomSpacer from '../components/BottomSpacer';
import ReferralCard from './../components/ReferralCard';
import { getAuthToken } from '../config';

const BoosterScreen = () => {
    const [boosters, setBoosters] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooster, setSelectedBooster] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBoosters = async () => {
            try {
                const token = getAuthToken();
                if (!token) {
                    setError("Authentication token not found");
                    setLoading(false);
                    return;
                }

                const response = await fetch('https://api.hashtagdigital.net/api/fetch-booster', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch boosters');
                }

                const data = await response.json();
                setBoosters(data.boosters);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching boosters:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBoosters();
    }, []);

    const handleModalOpen = (booster) => {
        setSelectedBooster({
            ...booster,
            tonPrice: booster.tonAmount,
            starPrice: booster.starAmount,
            htc: booster.htcAmount
        });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedBooster(null);
    };

    if (loading) {
        return <div className="loading">Loading boosters...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="app">
            <div className="header">
                <button className="back-button">←</button>
                <h1 className="title">Boosters</h1>
            </div>

            <div className="booster-cards-container">
                <h2 className="booster-title-header">Boost To Earn More Points</h2>
                {boosters.map((booster) => (
                    <div key={booster.id} className="booster-card">
                        <img 
                            src={require("../assets/crypto.png")} 
                            alt={booster.title} 
                            className="booster-icon" 
                        />
                        <div className="booster-card-header">
                            <h3 className="booster-title">{booster.title}</h3>
                            <p className="booster-text">{booster.text}</p>
                        </div>
                        <button 
                            className="booster-button" 
                            onClick={() => handleModalOpen(booster)}
                        >
                            Activate me
                        </button>
                    </div>
                ))}
            </div>

            <div className="referral-section">
                <ReferralCard showHeader={false} />
            </div>

            {isModalOpen && selectedBooster && (
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