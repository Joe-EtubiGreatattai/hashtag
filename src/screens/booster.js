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
    const [activeBoosters, setActiveBoosters] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooster, setSelectedBooster] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activating, setActivating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getAuthToken();
                if (!token) {
                    setError("Authentication token not found");
                    setLoading(false);
                    return;
                }

                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                // Fetch both boosters and active boosters in parallel
                const [boostersResponse, activeBoostersResponse] = await Promise.all([
                    fetch('https://api.hashtagdigital.net/api/fetch-booster', { headers }),
                    fetch('https://api.hashtagdigital.net/api/fetch-active-boosters', { headers })
                ]);

                if (!boostersResponse.ok || !activeBoostersResponse.ok) {
                    throw new Error('Failed to fetch booster data');
                }

                const [boostersData, activeBoostersData] = await Promise.all([
                    boostersResponse.json(),
                    activeBoostersResponse.json()
                ]);

                const sortedBoosters = boostersData.boosters.sort((a, b) => 
                    parseInt(a.order) - parseInt(b.order)
                );

                setBoosters(sortedBoosters);
                setActiveBoosters(activeBoostersData.activeBoosters);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const isBoosterActive = (boosterId) => {
        return activeBoosters.some(activeBooster => activeBooster.boosterID === boosterId);
    };

    const getBoosterActivationTime = (boosterId) => {
        const activeBooster = activeBoosters.find(booster => booster.boosterID === boosterId);
        return activeBooster ? new Date(activeBooster.createdAt) : null;
    };

    const activateBooster = async (boosterId, paymentMethod) => {
        setActivating(true);
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error("Authentication token not found");
            }

            const response = await fetch('https://api.hashtagdigital.net/api/activate-booster-package', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentMethod: paymentMethod,
                    boosterID: boosterId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to activate booster');
            }

            // Refresh active boosters after successful activation
            const activeBoostersResponse = await fetch('https://api.hashtagdigital.net/api/fetch-active-boosters', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const activeBoostersData = await activeBoostersResponse.json();
            setActiveBoosters(activeBoostersData.activeBoosters);

            setIsModalOpen(false);
            return { success: true, message: data.message };

        } catch (error) {
            console.error('Error activating booster:', error);
            return { success: false, message: error.message };
        } finally {
            setActivating(false);
        }
    };

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

    const formatActivationTime = (date) => {
        return new Date(date).toLocaleString();
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
                {boosters.map((booster) => {
                    const isActive = isBoosterActive(booster.id);
                    return (
                        <div key={booster.id} className={`booster-card ${isActive ? 'active' : ''}`}>
                            <img 
                                src={require("../assets/crypto.png")} 
                                alt={booster.title} 
                                className="booster-icon" 
                            />
                            <div className="booster-card-header">
                                <h3 className="booster-title">{booster.title}</h3>
                                <p className="booster-text">{booster.text}</p>
                                {/* {isActive && (
                                    <p className="activation-time">
                                        Active since: {formatActivationTime(getBoosterActivationTime(booster.id))}
                                    </p>
                                )} */}
                            </div>
                            <button 
                                className={`booster-button ${isActive ? 'active' : ''}`}
                                onClick={() => !isActive && handleModalOpen(booster)}
                                disabled={isActive}
                            >
                                {isActive ? 'Active' : 'Activate me'}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* <div className="referral-section">
                <ReferralCard showHeader={false} />
            </div> */}

            {isModalOpen && selectedBooster && (
                <BoostModal
                    onClose={handleModalClose}
                    booster={selectedBooster}
                    onActivate={activateBooster}
                    isActivating={activating}
                />
            )}

            <BottomSpacer />
        </div>
    );
};

export default BoosterScreen;