import React from "react";

const FixedLogo = ({ top = "35%" }) => {
  return (
    <div className="avatar-card-container" style={{ top }}>
      {/* Avatar Card */}
      <div className="avatar-card">
        <img
          src={require("../assets/bg-2.png")}
          alt="Avatar"
          className="avatar-image"
        />
      </div>

      {/* Styles */}
      <style>
        {`
          .avatar-card-container {
            position: fixed;
            top: ${top};  /* dynamic top value */
            z-index: 2;
          }

          .avatar-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0px;
            cursor: pointer;
          }

          .avatar-image {
            width: 100%;
          }

          .popup-message {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            text-align: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
            animation: fadeUp 2s ease-out forwards;
          }

          @keyframes fadeUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default FixedLogo;
