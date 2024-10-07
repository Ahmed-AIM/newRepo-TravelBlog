import React, { useEffect, useState } from 'react';
import '../styles/Destinations.css';
import BlogPost from './BlogPost';
import { POSTS_API } from '../apiConfig';
import { useNavigate } from 'react-router-dom';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [uniqueDestinations, setUniqueDestinations] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetch(POSTS_API)
      .then(response => response.json())
      .then(data => {
        setDestinations(data);
        const allDestinations = data.flatMap(post => post.Destination);
        const uniqueDestinations = [...new Set(allDestinations)];
        setUniqueDestinations(uniqueDestinations);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleCityClick = (city) => {
    setSelectedCity(city);
    const cityPosts = destinations.filter(post => post.Destination.includes(city));
    setPosts(cityPosts);
  };

  const handleTitleClick = (postId) => {
    navigate(`/${postId}`);
  };

  return (
    <div className="destinations-container">
      <h1 style={{fontFamily:'comic sans ms', color:'#154360', fontSize:'50px'}}>Popular Destinations</h1>
      <div className="destinations-list">
        {uniqueDestinations.map((destination, index) => (
          <div key={index} className="destination-card" onClick={() => handleCityClick(destination)}>
            <h4 style={{fontFamily:'comic sans ms', color:'#154360', fontSize:'30px', textAlign:'center'}}>{destination}</h4>
          </div>
        ))}
      </div>
      {selectedCity && (
        <div className="dest-post-container">
          <h2 style={{fontFamily:'comic sans ms', color:'#154360', fontSize:'50px'}}>Blog Posts about {selectedCity}</h2>
          <div className="destination-posts">
          {posts.map((post, index) => (
            <div className="post-card" key={post.id}>
              
      <h1 className="post-title" onClick={() => handleTitleClick(post.id)} style={{fontFamily:'comic sans ms', color:'#154360', cursor:'pointer'}}>{post.title}</h1>
      
      <div className="post-meta">
        <span>By: {post.author.Uname}</span> | <span>{post.date}</span> 
        <div>
        <span>Destination: {Array.isArray(post.Destination) ? post.Destination.join(', ') : post.Destination}</span> |  <span>Country: {post.Country}</span>
        <div>
        <span><span style={{color: 'blue'}}> Tags: </span> {post.tags.join(', ')}</span>
        </div>
          </div> 
      </div>
           
            {/* <BlogPost key={post.id} post={post} /> */}
          </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Destinations;