import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { POSTS_API } from '../apiConfig';
import '../styles/Sidebar.css';

const Sidebar = ({ recentPosts }) => {
  const [sidebarCategories, setSidebarCategories] = useState([]);

  useEffect(() => {
    fetch(POSTS_API)
      .then(response => response.json())
      .then(data => {
        const categories = [...new Set(data.flatMap(post => post.tags))];
        setSidebarCategories(categories);
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, []); // Remove the category dependency if it's not needed

  // const handleCategoryClick = (category) => {
  //   navigate(`/category/${category.toLowerCase()}`);
  //   handleFilterChange(category.toLowerCase());

  //   console.log(`Navigating to category: ${category.toLowerCase()}`);

  // };

  return (
    
    <aside className="sidebar">
      <div className="about-author">
        <h2>About the Author</h2>
        <p>Short bio about the author...</p>
      </div>
      <div className="recent-posts">
        <h2>Recent Posts</h2>
        <ul>
          {recentPosts.map(post => (
            <li key={post.id}><Link to={`/post/${post.id}`}>{post.title}</Link></li>
          ))}
        </ul>
      </div>
      <div className="categories">
        <h2>Categories</h2>
        <ul>
          {sidebarCategories.map(tag => (
            // <li key={tag} onClick={() => handleCategoryClick(tag)}> {tag} </li>
            <li key={tag}><Link to={`/category/${tag.toLowerCase()}`}>{tag}</Link></li>
            
          ))}
        </ul>
      </div>
      <div className="social-media">
        <h2>Follow Us</h2>
        <a href="https://facebook.com" className="social-link">Facebook</a>
        <a href="https://twitter.com" className="social-link">Twitter</a>
        <a href="https://instagram.com" className="social-link">Instagram</a>
      </div>
    </aside>
  );
};
export default Sidebar;