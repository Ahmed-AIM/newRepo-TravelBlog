import React, { useState, useEffect } from 'react';
import { POSTS_API } from '../apiConfig';
import '../styles/CommentSection.css';

const CommentSection = ({ postId, comments }) => {
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState(comments || []);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLocalComments(comments || []);
    // Try to get user info from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentData = {
      userid: user?.id || 'anonymous',
      comName: user?.username || 'Anonymous',
      comment: newComment,
      date: new Date().toISOString()
    };

    try {
      const response = await fetch(`${POSTS_API}/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const newCommentFromServer = await response.json();
      setLocalComments(prevComments => [...prevComments, newCommentFromServer]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      // Consider adding user feedback for the error
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {localComments.length > 0 ? (
        <ul className="comment-list">
          {localComments.map((comment, index) => (
            <li key={comment.id || index} className="comment">
              <p className="comment-author">{comment.comName || 'Anonymous'}</p>
              <p className="comment-content">{comment.comment}</p>
              <p className="comment-date">{new Date(comment.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          required
        />
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
};

export default CommentSection;
