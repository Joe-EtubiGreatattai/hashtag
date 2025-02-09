import React, { useState, useEffect } from "react";
import { useTelegram } from "../hooks/useTelegram";
import TelegramLoginButton from "react-telegram-login";
import "../App.css";
import Header from "../components/Header";
import AvatarCard from "../components/AvatarCard";
import RewardModal from "../components/RewardModal";
import ClaimSection from "../components/ClaimSection";
import GamifySystemCard from "../components/GamifySystemCard";
import BuyTokenComponent from "../components/BuyTokenComponent";
import BottomSpacer from "../components/BottomSpacer";
import ConnectWallet from "../components/ConnectWallet";
import { getAuthToken, setAuthToken, removeAuthToken } from "../config";

const DEFAULT_USER = {
    id: "guest",
    username: "Guest User",
    first_name: "Guest",
    last_name: "",
    photo_url: "https://via.placeholder.com/50",
};

const App = () => {
    const { user, theme, startParam, expand, close, showMainButton } = useTelegram();
    const [showBuyToken, setShowBuyToken] = useState(false);
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);
    const [showConnectWallet, setShowConnectWallet] = useState(false);
    const [farming, setFarming] = useState(false);
    const [farmingStatus, setFarmingStatus] = useState({
        isActive: false,
        startTime: null,
    });

    useEffect(() => {
        expand(); // Expand app
        showMainButton("Submit", () => alert("Main Button Clicked!"));
        fetchFarmingStatus();
        const intervalId = setInterval(fetchFarmingStatus, 30000);
        return () => clearInterval(intervalId);
    }, []);

    // Fetch farming status from API
    const fetchFarmingStatus = async () => {
        try {
            const token = getAuthToken();
            if (!token) return;

            const response = await fetch("https://api.hashtagdigital.net/api/fetch-farming-status", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to fetch farming status");

            const data = await response.json();
            setFarmingStatus({
                isActive: data.status,
                startTime: data.startTime ? new Date(data.startTime) : null,
            });
            setFarming(data.status);
        } catch (error) {
            console.error("Error fetching farming status:", error);
        }
    };

    // Handle Telegram WebApp authentication
    const verifyTelegramWebApp = async (initData) => {
        try {
            const response = await fetch("https://api.hashtagdigital.net/api/auth/telegram_auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ initData }),
            });

            if (!response.ok) throw new Error("WebApp verification failed");

            const data = await response.json();
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                setAuthToken(data.user.token);
            }
        } catch (error) {
            console.error("Failed to verify Telegram WebApp authentication");
        }
    };

    const handleStartFarming = async () => {
        if (farming) return;

        try {
            const token = getAuthToken();
            const response = await fetch("https://api.hashtagdigital.net/api/start-farming", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (data.message === "Farming is already active") {
                setFarmingStatus({ isActive: true, startTime: new Date(data.startTime) });
                setFarming(true);
            } else {
                await fetchFarmingStatus();
            }
        } catch (error) {
            console.error("Error starting farming:", error);
        }
    };

    const handleWalletConnect = (account) => {
        setWalletConnected(true);
        setShowConnectWallet(false);
        console.log("Wallet connected:", account);
    };

    const handleBuyToken = () => {
        setShowBuyToken(true);
    };

    return (
        <div className={`appII ${theme === "dark" ? "dark-mode" : ""}`}>
            <Header
                username={user?.username || "Guest"}
                level="LV 1"
                profilePhoto={user?.photo_url}
                onConnectWallet={() => setShowConnectWallet(true)}
                walletConnected={walletConnected}
            />

            {/* Show Telegram login button if user is not authenticated */}
            {!user?.id && (
                <div className="text-center my-4">
                    <TelegramLoginButton botName="Hashtag001bot" dataOnauth={verifyTelegramWebApp} />
                </div>
            )}

            {/* Wallet connection modal */}
            {showConnectWallet && !walletConnected && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg">
                        <ConnectWallet onConnect={handleWalletConnect} />
                        <button onClick={() => setShowConnectWallet(false)} className="mt-4 text-gray-500 hover:text-gray-700">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Main App UI */}
            {!showBuyToken && (
                <>
                    <ClaimSection onClaimClick={() => setShowRewardModal(true)} />
                    <AvatarCard profilePhoto={user?.photo_url} username={user?.username || "Guest"} />
                    <GamifySystemCard
                        title=""
                        cardText="Claim Your "
                        buttonLabel="Daily Bonus"
                        onButtonClick={() => setShowRewardModal(true)}
                        button1Label={farming ? "Farming Active" : "Start Farming"}
                        button2Label="Buy $HTC"
                        onButton1Click={handleStartFarming}
                        onButton2Click={handleBuyToken}
                        additionalStats={{ XP: "120", Rank: "Gold", Streak: "5 Days" }}
                    />
                </>
            )}

            {/* Show Reward Modal */}
            {showRewardModal && <RewardModal onClose={() => setShowRewardModal(false)} />}

            {/* Show Buy Token Component */}
            {showBuyToken && <BuyTokenComponent onBack={() => setShowBuyToken(false)} />}

            <BottomSpacer />
        </div>
    );
};

export default App;
