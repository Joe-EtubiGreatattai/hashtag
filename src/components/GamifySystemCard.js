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
    <div className="w-[90%] sm:w-[80%] p-7 sm:p-9 rounded-[40px]">
      {/* Title */}
      <h2 className="text-white text-lg sm:text-xl font-semibold">{title}</h2>

      {/* Card */}
      <div className="bg-pink-500 rounded-[40px] p-5 sm:p-7 flex items-center justify-between">
        {/* Left side with icon and text */}
        <div className="flex items-center space-x-4 sm:space-x-5 mr-4 sm:mr-5">
          <div className="text-white"></div>
          <span className="text-white text-base sm:text-lg font-semibold">{cardText}</span>
        </div>

        {/* Play button */}
        <button 
          className="bg-pink-200 text-purple-700 px-5 py-3 sm:px-7 sm:py-4 rounded-3xl font-semibold text-base sm:text-lg"
          onClick={onButtonClick}
        >
          {buttonLabel}
        </button>
      </div>

      {/* Buttons at the bottom */}
      <div className="flex justify-between mt-5 sm:mt-7">
        <button 
          className="bg-black text-white px-5 py-3 sm:px-7 sm:py-4 rounded-3xl text-base sm:text-lg"
          onClick={onButton1Click}
        >
          {button1Label}
        </button>
        <button 
          className="bg-black text-white px-5 py-3 sm:px-7 sm:py-4 rounded-3xl text-base sm:text-lg"
          onClick={onButton2Click}
        >
          {button2Label}
        </button>
      </div>
    </div>
  );
};

export default GamifySystemCard;