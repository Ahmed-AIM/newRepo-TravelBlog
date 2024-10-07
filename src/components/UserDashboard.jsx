import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { POSTS_API, USERS_API } from '../apiConfig';
import '../styles/UserDashboard.css'; // Update the import path
// import EditProfileForm from './EditProfileForm';

const UserDashboard = ({ userId }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    socialMedia: {},
    UserName: { first: '', last: '' }
  });
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
    fetchFavoritePosts();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${USERS_API}/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      setUser({
        ...userData,
        savedDestinations: userData.savedDestinations || []
      });
      setIsLoading(false);
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        bio: userData.bio || '',
        socialMedia: { ...userData.socialMedia } || {},
        UserName: {
          first: userData.UserName?.first || '',
          last: userData.UserName?.last || ''
        }
      });
      setProfileImage(userData.profilePicture || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data. Please try again later.');
      setIsLoading(false);
    }
  };

  const EditProfileForm = ({ user, onUpdateProfile, onCancel }) => {
    const [formData, setFormData] = useState({
      username: user.username || '',
      email: user.email || '',
      bio: user.bio || '',
      socialMedia: { ...user.socialMedia } || {},
      UserName: {
        first: user.UserName?.first || '',
        last: user.UserName?.last || ''
      }
    });
    const [profileImage, setProfileImage] = useState(user.profilePicture || '');
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'first' || name === 'last') {
        setFormData(prevState => ({
          ...prevState,
          UserName: {
            ...prevState.UserName,
            [name]: value
          }
        }));
      } else {
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    };
  
    const handleSocialMediaChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        socialMedia: {
          ...prevState.socialMedia,
          [name]: value
        }
      }));
    };
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${USERS_API}/${user.id}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...formData, profilePicture: profileImage}),
        });
        if (response.ok) {
          const updatedUser = await response.json();
          onUpdateProfile(updatedUser);
        } else {
          console.error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <h2>Edit Profile</h2>
        <div>
          <label htmlFor="profileImage">Profile Image:</label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {profileImage && (
          <div className="image-preview">
            <img src={profileImage} alt="Profile Preview" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
          </div>
        )}
        <div className='edit-profile-username'>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className='edit-profile-firstname'>
          <label htmlFor="first">First Name:</label>
          <input
            type="text"
            id="first"
            name="first"
            value={formData.UserName.first}
            onChange={handleChange}
            required
          />
        </div>
        <div className='edit-profile-lastname'>
          <label htmlFor="last">Last Name:</label>
          <input
            type="text"
            id="last"
            name="last"
            value={formData.UserName.last}
            onChange={handleChange}
            required
          />
        </div>
        <div className='edit-profile-email'>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='edit-profile-bio'>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
        {Object.entries(formData.socialMedia).map(([platform, handle]) => (
          <div key={platform}>
            <label htmlFor={platform}>{platform}:</label>
            <input
              type="text"
              id={platform}
              name={platform}
              value={handle}
              onChange={handleSocialMediaChange}
            />
          </div>
        ))}
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    );
  };

  const fetchUserPosts = async () => {
    try {
      setIsPostsLoading(true);
      const response = await fetch(POSTS_API);
      const allPosts = await response.json();
      
      const userPosts = allPosts.filter(post => post.author.uId === userId);
      
      setPosts(userPosts);
      
      setIsPostsLoading(false);
    } catch (error) {
      console.error('Error fetching posts data:', error);
      setError('Failed to load posts. Please try again later.');
      setIsPostsLoading(false);
    }
  };

  const fetchFavoritePosts = async () => {
    try {
      const favoritePostIdsResponse = await axios.get(`${USERS_API}/${userId}/favoritePostIds`);
      const favoritePostIds = favoritePostIdsResponse.data;

      const postsResponse = await axios.get(POSTS_API);
      const allPosts = postsResponse.data;
      
      const favoritePosts = allPosts.filter(post => favoritePostIds.includes(post.id));
      setFavoritePosts(favoritePosts);
    } catch (error) {
      console.error('Error fetching favorite posts:', error);
      setError('Failed to load favorite posts. Please try again later.');
    }
  };
  
  const removeFavorite = async (postId) => {
    try {
      await axios.delete(`${USERS_API}/${userId}/favoritePostIds/${postId}`);
      setFavoritePosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      setUser(prevUser => ({
        ...prevUser,
        favoritePostIds: prevUser.favoritePostIds.filter(id => id !== postId)
      }));
      console.log('Favorite removed successfully');
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const renderProfile = () => {
    if (isLoading) {
      return <div>Loading user data...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (!user) {
      return <div>Error loading user data. Please try again later.</div>;
    }

    const displayName = user.UserName ? `${user.UserName.first} ${user.UserName.last}` : user.username || 'User';

    return (
      <div className="user-profile">
        {isEditing ? (
          <EditProfileForm
            user={user}
            onUpdateProfile={(updatedUser) => {
              setUser(updatedUser);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <img 
              src={user.profilePicture || './img/user1.png'} 
              alt={displayName} 
              className="profile-picture" 
            />
            <h2>Welcome, {displayName}!</h2>
            <p>{user.bio}</p>
            <p>Email: {user.email}</p>
            <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
            <div className="social-links">
              {Object.entries(user.socialMedia || {}).map(([platform, handle]) => (
                <a key={platform} href={`https://${platform}.com/${handle}`} target="_blank" rel="noopener noreferrer">
                  {platform}
                </a>
              ))}
            </div>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>
    );
  };

  const renderPosts = () => (
    <div className="user-posts">
      <h3>Your Posts</h3>
      <button onClick={() => navigate('/new-post')} className="btn btn-primary">Create New Post</button>
      {isPostsLoading ? (
        <div>Loading posts...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : posts.length > 0 ? (
        posts.map(post => (
          <div key={post.id} className="post-item">
            <h4>{post.title}</h4>
            <div className="post-images">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post ${index + 1}`}
                />
              ))}
            </div>
            <p>{post.content.substring(0, 100)}...</p>
            
            
            <button onClick={() => handleEditPost(post.id)} className="btn btn-secondary">Edit</button>
            <button onClick={() => handleDeletePost(post.id)} className="btn btn-danger">Delete</button>
            
            
          </div>
        ))
      ) : (
        <p>You haven't created any posts yet.</p>
      )}
    </div>
  );

  const renderFavoritePosts = () => {
    const handleRemoveFavorite = (postId) => {
      if (window.confirm("Are you sure you want to remove this post from your favorites?")) {
        removeFavorite(postId);
      }
    };

    return (
      <div className="favorite-posts">
        <h3>Favorite Posts</h3>
        {favoritePosts.length > 0 ? (
          <ul>
            {favoritePosts.map((post) => (
              <li key={post.id}>
                <h4>{post.title}</h4>
                <p>By: {post.author.Uname}</p>
                <button onClick={() => navigate(`/${post.id}`)} className="btn btn-secondary">View Post</button>
                <button onClick={() => handleRemoveFavorite(post.id)} className="btn btn-secondary">Remove Favorite</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorite posts found. Start exploring and save your favorite posts!</p>
        )}
      </div>
    );
  };

  const renderSavedDestinations = () => (
    <div className="saved-destinations">
      <h3>Saved Destinations</h3>
      {user && user.savedDestinations && user.savedDestinations.length > 0 ? (
        <ul>
          {user.savedDestinations.map((destination, index) => (
            <li key={index} onClick={() => handleCityClick(destination)}>
              {destination}
            </li>
          ))}
        </ul>
      ) : (
        <p>No saved destinations found. Start exploring and save your favorite places!</p>
      )}
    </div>
  );

  const handleCityClick = (destination) => {
    navigate(`/destinations`);
  };

  const handleEditPost = (postId) => {
    navigate(`/${postId}?edit-post`);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`${POSTS_API}/${postId}`);
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        console.log('Post deleted successfully');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      {user && (
        <>
          <div className="dashboard-tabs">
            <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>Profile</button>
            <button onClick={() => setActiveTab('posts')} className={activeTab === 'posts' ? 'active' : ''}>My Posts</button>
            <button onClick={() => setActiveTab('favoritePosts')} className={activeTab === 'favoritePosts' ? 'active' : ''}>Favorite Posts</button> 
            <button onClick={() => setActiveTab('savedDestinations')} className={activeTab === 'savedDestinations' ? 'active' : ''}>Saved Destinations</button>
          </div>
          <div className="dashboard-content">
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'posts' && renderPosts()}
            {activeTab === 'favoritePosts' && renderFavoritePosts()}
            {activeTab === 'savedDestinations' && renderSavedDestinations()}
          </div>
        </>
      )}
     
    </div>
  );
};

export default UserDashboard;