import { faFacebookF, faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BlogPost.css';
import CollapsableComments from './CollapsableComments';

const BlogPost = ({ post }) => {
  const navigate = useNavigate();

  const handleTitleClick = (postId) => {
    navigate(`/${postId}`);
  };


  const handleImageClick = (image) => {
    document.getElementById('featured-image').src = image;

  };

  const generateShareLink = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    
    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
      case 'linkedin':
        return `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
      default:
        return '';
    }
  };

  return (
    <div className="blog-post">
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
      <img id={`featured-image-${post.id}`} src={post.images[0]} alt={post.title} className="featured-image" />
      <div className="post-images">
        {post.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Post ${index + 1}`}
            // style={{width:'100px', height:'100px', objectFit:'cover'}}
            onClick={() => {
              document.getElementById(`featured-image-${post.id}`).src = image;
            }}
          />
        ))}
      </div>
      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }}></div>
      <div className="post-footer">
        <div className="social-share">
          <a href={generateShareLink('facebook')} target="_blank" rel="noopener noreferrer" className="social-share-button">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a href={generateShareLink('twitter')} target="_blank" rel="noopener noreferrer" className="social-share-button">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href={generateShareLink('linkedin')} target="_blank" rel="noopener noreferrer" className="social-share-button">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
        </div>
        <CollapsableComments postId={post.id} comments={post.comments} />
      </div>
    </div>
  );
};

export default BlogPost;
