import React from "react";
import "./AvatarCard.css"; // Import the CSS file

const AvatarCard = ({ onClaim }) => {
  return (
    <div className="avatar-card-container">
      {/* Avatar Card */}
      <div className="avatar-card">
        <img
          src={require("../assets/logo-2.png")}
          alt="Avatar"
          className="avatar-image"
        />
      </div>
    </div>
  );
};

export default AvatarCard;
