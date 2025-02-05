import React from "react";
import TelegramLoginButton from "react-telegram-login";

const TelegramAuth = () => {
  const handleTelegramResponse = (response) => {
    console.log("User Data:", response);

    // Send user data to backend for verification
    fetch("https://api.hashtagdigital.net/telegram_auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    })
      .then((res) => res.json())
      .then((data) => console.log("Server Response:", data))
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div>
      <h2>Login with Telegram</h2>
      <TelegramLoginButton
        botName="@Hashtag001bot" // Replace with your bot's username
        dataOnauth={handleTelegramResponse}
      />
    </div>
  );
};

export default TelegramAuth;