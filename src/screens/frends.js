import React from 'react';
import ReferralComponent from "../components/referalButton";

const FriendsScreen = () => {
  const referralTiers = [
    { title: 'Invite 1 Friend', reward: '+3000 $HTC' },
    { title: 'Invite 5 Friends', reward: '+10000 $HTC' },
    { title: 'Invite 20 Friends', reward: '+20000 $HTC' },
    { title: 'Invite 50 Friends', reward: '+40000 $HTC' },
    { title: 'Subscribe Telegram Premium', reward: '+50000 $HTC' },
  ];

  return (
    <div className="min-h-screen bg-[#00205B] text-white p-4 flex flex-col">
      {/* Header */}
      <div className="relative flex items-center justify-center mb-8">
        {/* <button className="absolute left-0 text-2xl p-2 text-white">←</button> */}
        <h1 className="text-2xl font-semibold">Friends</h1>
      </div>


      <img src={require('../assets/logo-big.png')} alt='' className="friend-logo" />
      <h2 className="friend-title">Invite friends!</h2>
      <p className="friend-sub">You and your friend will receive</p>

      {/* Reward Buttons */}
      <div className="flex gap-4 mb-6">
        <button className="bg-white text-[#00205B] font-semibold rounded-xl px-4 py-2 hover:bg-white/90">
          +1000 $HTC
        </button>
        <button className="bg-white text-[#00205B] font-semibold rounded-xl px-4 py-2 hover:bg-white/90">
          +10K $HTC with Telegram Premium
        </button>
      </div>

      {/* Total Referrals */}
      <ReferralComponent />

      {/* Info Text */}
      <p className="text-center mb-8 text-lg">
        Every invite increases your $HTC points, making you ahead on the leaderboard. More invites, more TGE rewards.
      </p>

      {/* Referral Tiers */}
      <div className="space-y-4 flex-1 overflow-auto">
        {referralTiers.map((tier, index) => (
          <div
            key={index}
            className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{tier.title}</h3>
              <p className="text-gray-200">Reward: {tier.reward}</p>
            </div>
            <button className="bg-white text-[#00205B] hover:bg-white/90 rounded-xl px-4 py-2">
              Claim
            </button>
          </div>
        ))}
      </div>

      {/* Spacer to push content up */}
      <div className="h-16"></div>
    </div>
  );
};

export default FriendsScreen;
