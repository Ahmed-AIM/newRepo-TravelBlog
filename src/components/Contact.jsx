import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>If you have any questions, issues, or suggestions, please don't hesitate to reach out to us. We are here to help and would love to hear from you!</p>
      <div className="contact-details">
        <h2>Contact Details</h2>
        <p><strong>Email:</strong> support@travelblog.com</p>
        <p><strong>Phone:</strong> +1 (123) 456-7890</p>
        <p><strong>Address:</strong> 123 Travel Blog St, Adventure City, Egypt</p>
      </div>
      <p>We value your feedback and strive to improve our blog to better serve our community. Your input is essential in helping us achieve this goal. Thank you for being a part of our travel community!</p>
    </div>
  );
};

export default Contact;