import React, { useState } from 'react';
import CommentSection from './CommentSection';
import '../styles/CollapsableComments.css';

const CollapsableComments = ({ postId, comments }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleComments = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="collapsable-comments">
      <button onClick={toggleComments} className="toggle-comments-btn">
        {isExpanded ? 'Hide Comments' : `Show Comments (${comments.length})`}
      </button>
      {isExpanded && <CommentSection postId={postId} comments={comments} />}
    </div>
  );
};

export default CollapsableComments;
