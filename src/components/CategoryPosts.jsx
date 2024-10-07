import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogPost from './BlogPost';
import { POSTS_API } from '../apiConfig';
import '../styles/CategoryPosts.css';

const CategoryPosts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { category } = useParams();

  useEffect(() => {
    fetch(POSTS_API)
      .then(response => response.json())
      .then(data => {
        const filteredPosts = data.filter(post => 
          post.tags.map(tag => tag.toLowerCase()).includes(category.toLowerCase())
        );
        setPosts(filteredPosts);
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, [category]);


  const handleTitleClick = (postId) => {
    navigate(`/${postId}`);
  };

  return (
   
    <div className="category-posts">
      <h2>Posts in {category}</h2>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post.id} className="blog-post">
            <h1 className="post-title" onClick={() => handleTitleClick(post.id)} style={{fontFamily:'comic sans ms', color:'#154360', cursor:'pointer'}}>{post.title}</h1>
            <div className="post-meta">
              <span>By: {post.author.Uname}</span> | <span>{post.date}</span> 
              <div>
                <span>Destination: {Array.isArray(post.Destination) ? post.Destination.join(', ') : post.Destination}</span> |  <span>Country: {post.Country}</span>
              </div>
              <div>
                <span><span style={{color: 'blue'}}> Tags: </span> {post.tags.join(', ')}</span>
              </div>
            </div>  
          </div>
        ))
      ) : (
        <p>No posts found in this category.</p>
      )}
    </div>
    
  );
};

export default CategoryPosts;
