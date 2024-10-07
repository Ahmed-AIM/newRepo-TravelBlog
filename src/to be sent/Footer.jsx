import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <nav className="footer-nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </nav>
        <div className="Footer-social-media" style={{display: 'flex', gap: '10px'}}>
          <a href="https://facebook.com" className="Footer-social-link">Facebook</a>
          <a href="https://twitter.com" className="Footer-social-link">Twitter</a>
          <a href="https://instagram.com" className="Footer-social-link">Instagram</a>
        </div>
        <p>&copy; 2023 Travel Blog. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;