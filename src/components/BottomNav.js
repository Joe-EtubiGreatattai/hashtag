import React from 'react';
import HTCFarmIcon from '../assets/miner.png';
import minIcon from '../assets/earn.png';
import boosterIcon from '../assets/booster.png';
import rankIcon from '../assets/rank.png';
import friendIcon from '../assets/friend.png';

const BottomNav = ({ activeTab, onTabClick }) => {
  return (
    <div style={styles.nav}>
      <div style={styles.tab}>
        <img
          src={HTCFarmIcon}
          alt="HTCFarm"
          onClick={() => onTabClick('home')}
          style={activeTab === 'home' ? { ...styles.icon, ...styles.activeIcon } : styles.icon}
        />
        <span style={styles.text}>HTCFarm</span>
      </div>
      <div style={styles.tab}>
        <img
          src={minIcon}
          alt="Tasks"
          onClick={() => onTabClick('gift')}
          style={activeTab === 'gift' ? { ...styles.icon, ...styles.activeIcon } : styles.icon}
        />
        <span style={styles.text}>Tasks</span>
      </div>
      <div style={styles.tab}>
        <img
          src={boosterIcon}
          alt="Booster"
          onClick={() => onTabClick('booster')}
          style={activeTab === 'booster' ? { ...styles.icon, ...styles.activeIcon } : styles.icon}
        />
        <span style={styles.text}>Booster</span>
      </div>
      <div style={styles.tab}>
        <img
          src={rankIcon}
          alt="Leaderboard"
          onClick={() => onTabClick('chart')}
          style={activeTab === 'chart' ? { ...styles.icon, ...styles.activeIcon } : styles.icon}
        />
        <span style={styles.text}>Rank</span>
      </div>
      <div style={styles.tab}>
        <img
          src={friendIcon}
          alt="Friends"
          onClick={() => onTabClick('friend')}
          style={activeTab === 'friend' ? { ...styles.icon, ...styles.activeIcon } : styles.icon}
        />
        <span style={styles.text}>Friend</span>
      </div>
    </div>
  );
};

const styles = {
  nav: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '20px 0',
    backgroundColor: '#022B89',
    marginBottom: '0',
    position: 'fixed',
    zIndex: 999999,
    bottom: '0'
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    width: '22px',
    height: '22px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, filter 0.3s ease',
    filter: 'grayscale(100%)',
    opacity: .4,
  },
  activeIcon: {
    transform: 'scale(1.2)',
    tint: 'Yellow',
    filter: 'grayscale(0%) sepia(100%) saturate(300%) brightness(100%) hue-rotate(10deg)',
    opacity: 1,
  },
  text: {
    marginTop: '5px',
    fontSize: '12px',
    color: '#fff',
  },
};

export default BottomNav;