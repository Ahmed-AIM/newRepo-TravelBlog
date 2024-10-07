import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { POSTS_API } from '../apiConfig';
import '../styles/BlogPostPage.css';
import BlogPost from './BlogPost';


const BlogPostPage = ({ currentUser }) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${POSTS_API}/${postId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
        
      })
      .then(data => {
        setPost(data);
      })
      .catch(error => {
        console.error('Error fetching post data:', error);
        setError(error.message);
      });
  }, [postId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdatePost = (updatedPost) => {
    setPost(updatedPost);
    setIsEditing(false);
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`${POSTS_API}/${post.id}`);

        navigate('/'); // Redirect to home page after deletion
      } catch (error) {
        console.error('Error deleting post:', error);
        setError('Failed to delete post. Please try again later.');
      }
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="blog-post-page">
      {post ? (
        isEditing ? (
          <EditPostForm
            post={post}
            onCancel={handleCancelEdit}
            onUpdate={handleUpdatePost}
          />
        ) : (
          <>
            <BlogPost key={post.id} post={post} comments={post.comments} user={user} setUser={setUser} />
            {currentUser === post.author.uId && (
              <div className="post-actions">
                <button className="btn btn-secondary" onClick={handleEditClick}>Edit Post</button>
                <button className="btn btn-danger" onClick={handleDeletePost}>Delete Post</button>
              </div>
            )}
          </>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

const EditPostForm = ({ post, onCancel, onUpdate }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [images, setImages] = useState(post.images);
  const [tags, setTags] = useState(post.tags.join(', '));
  const [destination, setDestination] = useState(post.Destination);
  const [country, setCountry] = useState(post.Country);
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedPost = {
        ...post,
        title,
        content,
        images: [images[featuredImageIndex], ...images.filter((_, index) => index !== featuredImageIndex)],
        tags: tags.split(',').map(tag => tag.trim()),
        Destination: destination,
        Country: country
      };
      const response = await axios.put(`${POSTS_API}/${post.id}`, updatedPost);
      onUpdate(response.data);
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post. Please try again later.');
    }
  };

  const handleImageUpload = (e) => {
    const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    if (index === featuredImageIndex) {
      setFeaturedImageIndex(0);
    }
  };

  const handleSetFeaturedImage = (index) => {
    setFeaturedImageIndex(index);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-post-form">
      <h2>Edit Post</h2>
      {error && <div className="error-message">{error}</div>}
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="destination">Destination:</label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="country">Country:</label>
        <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="tags">Tags (comma-separated):</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="images">Images:</label>
        <input
          type="file"
          id="images"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
        <div className="image-preview">
          {images.map((image, index) => (
            <div key={index} className="image-item">
              <img src={image} alt={`Post ${index + 1}`} />
              <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
              <button 
                type="button" 
                onClick={() => handleSetFeaturedImage(index)}
                className={index === featuredImageIndex ? 'featured' : ''}
              >
                {index === featuredImageIndex ? 'Featured' : 'Set as Featured'}
              </button>
            </div>
          ))}
        </div>
      </div>
      <button type="submit">Update Post</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default BlogPostPage;