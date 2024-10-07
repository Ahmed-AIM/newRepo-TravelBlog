import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';
import SearchBar from './SearchBar';

const NavBar = ({ user, onLogout }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">Travel Blog</Link>
        <SearchBar/>
        <span className="navbar-toggle" onClick={toggleNav}>&#9776;</span>
        <ul className={`navbar-nav ms-auto ${isNavOpen ? 'active' : ''}`}>
          <li><Link className="nav-link" to="/"><FontAwesomeIcon icon={faHome} /> Home</Link></li>
          <li><Link className="nav-link" to="/destinations">Destinations</Link></li>
          <li><Link className="nav-link" to="/about">About</Link></li>
          <li><Link className="nav-link" to="/contact">Contact Us</Link></li>
          {user ? (
            <>
              <li><Link className="nav-link" to="/dashboard"><i className="icon-dashboard"></i>Dashboard</Link></li>
              <li><div style={{display: 'flex', alignItems: 'center'}}>
              <img className="nav-link" onClick={onLogout} src="./img/logout.png" alt="Logout" description="Logout" style={{ width: '50px', height: '50px',cursor: 'pointer' }}></img>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <span style={{margin: '5px',color: 'white',fontSize: '10px'}}>Welcome</span>
              <h5 style={{margin: '5px',color: 'white'}}>{user.fullname.first}</h5>
                </div></div></li>
            </>
          ) : (
            <li><Link className="nav-link" to="/login">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
