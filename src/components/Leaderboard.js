import React from 'react';
import '../assets/styles/Leaderboard.css';

const Leaderboard = ({ data = [] }) => {
  return (
    <div className="leaderboard">
      <div className="trophy-container">
        <img
          src={require('../assets/trophy.png')}
          alt="Trophy"
          className="trophy-image"
        />
      </div>

      <h2 className="leaderboard-title">TOP HASHTAGGERS</h2>
  
      <div className="leaders-display">
        {data.map((leader) => (
          <div
            key={leader.id}
            className={`leader-item ${
              leader.position === 'center'
                ? 'leader-center'
                : leader.position === 'left'
                  ? 'leader-left'
                  : 'leader-right'
            }`}
          >
            <div className="avatar-container">
              <img
                src={leader.image}
                alt={leader.name}
                className={`avatar ${leader.position === 'center' ? 'avatar-center' : 'avatar-default'}`}
              />
              <div className="leader-rank">{leader.id}</div>
            </div>
            <div className="leader-info">
              <p className="leader-name">{leader.name}</p>
              <div className="leader-score">
                <img
                  src={require('../assets/ninja-coin.png')}
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