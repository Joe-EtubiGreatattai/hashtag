import React from 'react';
import { Share } from 'lucide-react';

const ReferralCard = () => {
  return (
    <div className="bg-gradient-to-br my-6 from-blue-50 to-blue-100 rounded-3xl p-6 relative overflow-hidden">
      {/* Share icon in top-left */}
      <div className="absolute top-6 left-6">
        <Share className="text-blue-900" size={24} />
      </div>

      {/* Main content */}
      <div className="mt-8">
        {/* Referral count */}
        <div className="flex items-baseline">
          <span className="text-blue-900 text-5xl font-bold">24</span>
          <span className="text-blue-900 text-xl ml-1">Total Referrals</span>
        </div>

        {/* Hashtag bonus text */}
        <div className="mt-1">
          <span className="text-pink-500 text-lg font-medium">+500 Hashtag per invite</span>
        </div>

        {/* Copy Link button */}
        <button className="mt-4 bg-blue-900 text-white px-6 py-3 rounded-xl font-medium text-lg">
          Copy Link
        </button>

        {/* Avatar image */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <div className="w-34 h-34 rounded-full bg-purple-100 overflow-hidden">
            <img
              src={require('./../assets/user2.png')}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralCard;