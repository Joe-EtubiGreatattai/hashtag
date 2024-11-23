import React, { useState, useEffect } from "react";
import "../App.css";

const AvatarCard = ({ onClaim }) => {
  const [tokens, setTokens] = useState(0); // Initialize tokens to 0
  const [showMessage, setShowMessage] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false); // Track if the user is claiming

  useEffect(() => {
    // Start adding tokens every second as soon as the component loads
    const timer = setInterval(() => {
      if (!isClaiming) {
        setTokens((prevTokens) => prevTokens + 1); // Add 1 token every second
      }
    }, 1000);

    // Clear the interval when the component is unmounted or when claiming
    return () => clearInterval(timer);
  }, [isClaiming]); // This effect depends on `isClaiming`

  const handleClick = () => {
    setIsClaiming(true); // Set to claiming to stop adding tokens
    setShowMessage(true); // Show the message

    // Hide message after 5 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 5000);

    // Call parent handler to reset timer if necessary
    if (onClaim) {
      onClaim();
    }
  };

  return (
    <div className="relative">
      {/* Avatar Card */}
      <div
        className="flex flex-col items-center m-5 cursor-pointer"
        onClick={handleClick}
      >
        <div className="rounded-full overflow-hidden w-[150px] h-[150px] bg-white">
          <img
            src={require("../assets/coin.png")}
            alt="Avatar"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Full-width Popup Message */}
      {showMessage && (
        <div
          className="absolute top-0 left-0 w-full text-center text-white text-3xl font-bold animate-fade-up"
          style={{
            animation: "fadeUp 2s ease-out forwards",
          }}
        >
          You claimed {tokens} tokens!
        </div>
      )}
    </div>
  );
};

export default AvatarCard;
