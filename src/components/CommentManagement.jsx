import React, { useState } from 'react';

const CommentManagement = ({ comments, onUpdateComment, onDeleteComment }) => {
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setEditedContent(comment.content);
  };

  const handleSave = () => {
    onUpdateComment(editingComment.id, editedContent);
    setEditingComment(null);
  };

  return (
    <div className="comment-management">
      <h2>Manage Comments</h2>
      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            {editingComment === comment ? (
              <>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditingComment(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>{comment.content}</p>
                <p className="comment-meta">
                  By: {comment.author} | On: {new Date(comment.date).toLocaleDateString()}
                </p>
                <button onClick={() => handleEdit(comment)}>Edit</button>
                <button onClick={() => onDeleteComment(comment.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentManagement;
