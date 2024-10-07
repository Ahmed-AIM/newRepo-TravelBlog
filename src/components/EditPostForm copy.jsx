import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { POSTS_API } from '../apiConfig';
import '../styles/EditPostForm.css';

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${POSTS_API}/${postId}`);
        const postData = response.data;
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setImages(postData.images);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post. Please try again later.');
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${POSTS_API}/${postId}`, {
        title,
        content,
        images
      });
      navigate(`/${postId}`);
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post. Please try again later.');
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="edit-post-form">
      <h2>Edit Post</h2>
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
        <label htmlFor="images">Images:</label>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Post ${index + 1}`} style={{width: '100px', height: '100px', objectFit: 'cover'}} />
            <button type="button" onClick={() => setImages(images.filter((_, i) => i !== index))}>Remove</button>
          </div>
        ))}
        <input
          type="file"
          id="images"
          accept="image/*"
          multiple
          onChange={(e) => {
            const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setImages([...images, ...newImages]);
          }}
        />
      </div>
      <button type="submit">Update Post</button>
      <button type="button" onClick={() => navigate(`/${postId}`)}>Cancel</button>
    </form>
  );
};

export default EditPostForm;