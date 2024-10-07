import React from 'react';

const PostList = ({ posts, onEditPost }) => {
  return (
    <div className="post-list">
      <h2>Your Posts</h2>
      {posts.map(post => (
        <div key={post.id} className="post-item">
          <h3>{post.title}</h3>
          <p>{post.content.substring(0, 100)}...</p>
          <button onClick={() => onEditPost(post.id)}>Edit</button>
        </div>
      ))}
    </div>
  );
};

export default PostList;
