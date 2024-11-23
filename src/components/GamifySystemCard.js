import React from 'react';
import { Music } from 'lucide-react';

const GamifySystemCard = () => {
  return (
    <div className="space-y-2">
      {/* Title */}
      <h2 className="text-white text-xl font-semibold">
        Tonic Sofa Gamify System
      </h2>
      
      {/* Pink Card */}
      <div className="bg-pink-500 rounded-2xl p-4 flex items-center justify-between">
        {/* Left side with icon and text */}
        <div className="flex items-center space-x-4">
          <div className="text-white">
            <Music size={28} />
          </div>
          <span className="text-white text-xl font-semibold">
            Coming Soon
          </span>
        </div>
        
        {/* Play button */}
        <button className="bg-pink-200 text-purple-700 px-6 py-2 rounded-xl font-semibold text-lg">
          Play
        </button>
      </div>
    </div>
  );
};

export default GamifySystemCard;