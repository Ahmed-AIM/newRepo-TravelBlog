import React, { useEffect, useState } from 'react';
import '../styles/Homepage.css';
import BlogPost from './BlogPost';
import FilterInput from './FilterInput'; // Add this import
import Sidebar from './Sidebar';
import { POSTS_API } from '../apiConfig';
import { USERS_API } from '../apiConfig';



const Homepage = ({ posts, user }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  


  useEffect(() => {
    fetch(POSTS_API)
      .then(response => response.json())
      .then(data => {
        setAllPosts(data);
        setFilteredPosts(data);
      
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  function handleFilterChange(filterText) {
    const filtered = allPosts.filter(post =>
      post.title.toLowerCase().includes(filterText.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(filterText.toLowerCase())) ||
      (Array.isArray(post.Destination)
        ? post.Destination.some(dest => dest.toLowerCase().includes(filterText.toLowerCase()))
        : post.Destination.toLowerCase().includes(filterText.toLowerCase()))
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className="homepage-container">
      <FilterInput onFilterChange={handleFilterChange} />
      <div className="main-content">
        <section className="section">
          {filteredPosts && filteredPosts.map(post => (
            <div key={post.id}>
              
              <BlogPost post={post} user={user} disableImageClass="featured-image"/>
            </div>
          ))}
        </section>
        {filteredPosts && <Sidebar recentPosts={filteredPosts.slice(0, 5)} />}
      </div>
    </div>
  );
};


export default Homepage;