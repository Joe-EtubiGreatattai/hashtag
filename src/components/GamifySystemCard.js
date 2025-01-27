import React from 'react';

const GamifySystemCard = ({ 
  title, 
  cardText, 
  buttonLabel, 
  onButtonClick, 
  button1Label, 
  button2Label, 
  onButton1Click, 
  onButton2Click 
}) => {
  return (
    <div className="">
      {/* Title */}
      <h2 className="text-white text-xl font-semibold">{title}</h2>
      {/* Card */}
      <div className="bg-pink-500 rounded-2xl p-4 flex items-center g-4 justify-between">
        {/* Left side with icon and text */}
        <div className="flex items-center space-x-4 mr-4">
          <div className="text-white"></div>
          <span className="text-white text-xl font-semibold">{cardText}</span>
        </div>

        {/* Play button */}
        <button 
          className="bg-pink-200 text-purple-700 px-6 py-2 rounded-xl font-semibold text-lg"
          onClick={onButtonClick}
        >
          {buttonLabel}
        </button>
      </div>

      {/* Buttons at the bottom */}
      <div className="flex justify-between mt-4">
        <button 
          className="bg-black text-white px-4 py-2 rounded-lg"
          onClick={onButton1Click}
        >
          {button1Label}
        </button>
        <button 
          className="bg-black text-white px-4 py-2 rounded-lg"
          onClick={onButton2Click}
        >
          {button2Label}
        </button>
      </div>
    </div>
  );
};

export default GamifySystemCard;
