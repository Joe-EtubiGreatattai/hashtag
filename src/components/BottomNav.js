import React from 'react';
import homeIcon from '../assets/earn.png';
import minIcon from '../assets/miner.png';
import boosterIcon from '../assets/booster.png';
import rankIcon from '../assets/rank.png';
import friendIcon from '../assets/friend.png';

const BottomNav = ({ activeTab, onTabClick }) => {
  return (
    <div style={styles.nav}>
      <div style={styles.tab}>
        <img
          src={homeIcon}
          alt="Home"
          onClick={() => onTabClick('home')}
          style={activeTab === 'home' ? { ...styles.icon, ...styles.activeIcon } : styles.icon}
        />
        <span style={styles.text}>Earn</span>
      </div>
      <div style={styles.tab}>
        <img
          src={minIcon}
          alt="Miner"
          onClick={() => onTabClick('gift')}
          style={activeTab === 'gift' ? { ...styles.icon, ...styles.activeIcon } : styles.icon}
        />
        <span style={styles.text}>Miner</span>
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
          alt="Rank"
          onClick={() => onTabClick('chart')}
          style={activeTab === 'user' ? { ...styles.icon, ...styles.activeIcon } : styles.icon}
        />
        <span style={styles.text}>Rank</span>
      </div>
      <div style={styles.tab}>
        <img
          src={friendIcon}
          alt="Friend"
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
    width: '90%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '20px 0',
    backgroundColor: '#022B89',
    marginBottom: '10px',
    borderRadius: '10px',
    position:'fixed',
    zIndex:999999,
    bottom:'0px'
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
  },
  activeIcon: {
    transform: 'scale(1.2)',
    filter: 'grayscale(0%)',
  },
  text: {
    marginTop: '5px',
    fontSize: '12px',
    color: '#fff',
  },
};

export default BottomNav;
