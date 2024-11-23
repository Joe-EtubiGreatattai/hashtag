import React from 'react';
import { FaHome, FaUserAlt, FaChartLine, FaGift } from 'react-icons/fa';

const BottomNav = ({ activeTab, onTabClick }) => {
  return (
    <div style={styles.nav}>
      <FaHome
        onClick={() => onTabClick('home')}
        style={activeTab === 'home' ? { ...styles.icon, ...styles.activeIcon } : styles.icon}
      />
      <FaGift
        onClick={() => onTabClick('gift')}
        style={activeTab === 'gift' ? { ...styles.icon, ...styles.activeIcon } : styles.icon}
      />
      <FaChartLine
        onClick={() => onTabClick('chart')}
        style={activeTab === 'chart' ? { ...styles.icon, ...styles.activeIcon } : styles.icon}
      />
      <FaUserAlt
        onClick={() => onTabClick('user')}
        style={activeTab === 'user' ? { ...styles.icon, ...styles.activeIcon } : styles.icon}
      />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  icon: {
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
  activeIcon: {
    color: '#FFD700', // Gold color for the active tab
    fontSize: '28px', // Slightly larger size for emphasis
  },
};

export default BottomNav;
