import React from 'react';
import '../assets/styles/Leaderboard.css'; // Import CSS

const Leaderboard = () => {
  const leaderboardData = [
    {
      id: 2,
      name: 'Fav',
      score: '80,001.14',
      position: 'left',
      image: require('../assets/user6.png'), // Unique image for Fav
    },
    {
      id: 1,
      name: 'Obed Rich',
      score: '75,899,999',
      position: 'center',
      image: require('../assets/user5.png'), // Unique image for Obed Rich
    },
    {
      id: 3,
      name: 'string#s',
      score: '62,142,521',
      position: 'right',
      image: require('../assets/user7.png'), // Unique image for string#s
    },
  ];

  return (
    <div className="leaderboard">
      {/* Trophy Image */}
      <div className="trophy-container">
        <img
          src={require('../assets/trophy.png')} /* Replace with actual trophy image URL */
          alt="Trophy"
          className="trophy-image"
        />
      </div>

      {/* Leaderboard Title */}
      <h2 className="leaderboard-title">TOP HASHTAGGERS</h2>
  
      {/* Leaders Display */}
      <div className="leaders-display">
        {leaderboardData.map((leader) => (
          <div
            key={leader.id}
            className={`leader-item ${leader.position === 'center'
                ? 'leader-center'
                : leader.position === 'left'
                  ? 'leader-left'
                  : 'leader-right'
              }`}
          >
            <div className="avatar-container">
              <img
                src={leader.image} // Use unique image for each leader
                alt={leader.name}
                className={`avatar ${leader.position === 'center' ? 'avatar-center' : 'avatar-default'
                  }`}
              />
              <div className="leader-rank">{leader.id}</div>
            </div>
            <div className="leader-info">
              <p className="leader-name">{leader.name}</p>
              <div className="leader-score">
                <img
                  src={require('../assets/ninja-coin.png')} // Use golden coin image
                  alt="Golden Coin"
                  style={{ width: '20px', marginRight: '8px' }}
                />
                {leader.score}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
