import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { POSTS_API } from '../apiConfig';
import '../styles/BlogPostPage.css';
import BlogPost from './BlogPost';


const BlogPostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

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

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="blog-post-page">
      {post ? (
        <>
          <BlogPost key={post.id} post={post} comments={post.comments} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BlogPostPage;

