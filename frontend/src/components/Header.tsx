import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <div>
      <nav className="navigation">
        <Link to="/">Home</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/file">File</Link>
        <Link to="game">Game</Link>
      </nav>
    </div>
  );
};

export default Header;
