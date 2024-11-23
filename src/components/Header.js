import React from 'react';

const Header = ({ username, level, profilePhoto }) => {
  return (
    <div style={styles.header}>
      <div style={styles.profileContainer}>
        <img
          src={require("../assets/user.png")}
          alt="Profile"
          style={styles.profilePhoto}
        />
        <div style={styles.textContainer}>
          <span style={styles.username}>{username}</span>
          <span style={styles.level}>{level}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
    marginLeft:'30px',
    marginTop:'30px'
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  profilePhoto: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
    fontSize: '16px',
  },
  level: {
    fontSize: '18px',
    color: '#fff',
  },
};

export default Header;
