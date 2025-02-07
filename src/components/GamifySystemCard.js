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
    <div className="w-[90%] sm:w-[80%] p-4 sm:p-6 rounded-2xl">
      {/* Title */}
      <h2 className="text-white text-lg sm:text-xl font-semibold">{title}</h2>

      {/* Card */}
      <div className="bg-pink-500 rounded-2xl p-2 sm:p-4 flex items-center justify-between">
        {/* Left side with icon and text */}
        <div className="flex items-center space-x-2 sm:space-x-4 mr-2 sm:mr-4">
          <div className="text-white"></div>
          <span className="text-white text-sm sm:text-xl font-semibold">{cardText}</span>
        </div>

        {/* Play button */}
        <button 
          className="bg-pink-200 text-purple-700 px-3 py-1 sm:px-6 sm:py-2 rounded-xl font-semibold text-sm sm:text-lg"
          onClick={onButtonClick}
        >
          {buttonLabel}
        </button>
      </div>

      {/* Buttons at the bottom */}
      <div className="flex justify-between mt-3 sm:mt-4">
        <button 
          className="bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base"
          onClick={onButton1Click}
        >
          {button1Label}
        </button>
        <button 
          className="bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base"
          onClick={onButton2Click}
        >
          {button2Label}
        </button>
      </div>
    </div>
  );
};

export default GamifySystemCard;