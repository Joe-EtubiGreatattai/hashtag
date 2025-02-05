import React, { useState } from "react";
import TelegramLoginButton from "react-telegram-login";

const TelegramAuth = () => {
  const [error, setError] = useState(null);

  const handleTelegramResponse = (response) => {
    console.log("User Data:", response);

    // Send user data to backend for verification
    fetch("https://api.hashtagdigital.net/api/auth/telegram_auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    })
      .then((res) => res.json())
      .then((data) => console.log("Server Response:", data))
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message || "An error occurred while processing your request.");
      });
  };

  return (
    <div>
      <h2>Login with Telegram</h2>
      <TelegramLoginButton
        botName="Hashtag001bot" // Replace with your bot's username
        dataOnauth={handleTelegramResponse}
      />
       <p style={{ color: "red" }}>Error: {error}</p>
    </div>
  );
};

export default TelegramAuth;
