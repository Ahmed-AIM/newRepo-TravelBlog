// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { POSTS_API, USERS_API } from '../apiConfig';
// import '../styles/UserDashboard.css'; // Update the import path
// import Destinations from './Destinations';


// const UserDashboard = ({ userId }) => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [likes, setLikes] = useState([]);
//   const [favoritePosts, setFavoritePosts] = useState([]);
//   const [comments, setComments] = useState([]);
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [profile, setProfile] = useState(null);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isPostsLoading, setIsPostsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [destinations, setDestinations] = useState([]);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     bio: '',
//     socialMedia: {},
//     UserName: { first: '', last: '' }
//   });
//   const [profileImage, setProfileImage] = useState('');


//   useEffect(() => {
//     fetchUserData();
//     fetchUserPosts();
//     fetchFavoritePosts();


//   }, [userId]);

//   const fetchUserData = async () => {
//     try {
//       const response = await fetch(`${USERS_API}/${userId}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const userData = await response.json();
//       setUser({
//         ...userData,
//         travelItineraries: userData.travelItineraries || [],
//         savedDestinations: userData.savedDestinations || []
//       });
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       setError('Failed to load user data. Please try again later.');
//       setIsLoading(false);
//     }
//   };

//   const fetchUserPosts = async () => {
//     try {
//       setIsPostsLoading(true);
//       const response = await fetch(POSTS_API);
//       const allPosts = await response.json();
      
//       const userPosts = allPosts.filter(post => post.author.uId === userId.toString());
//       const userDrafts = allPosts.filter(post => post.isDraft && post.author.uId === userId.toString());
      
//       setPosts(userPosts);
      
//       setIsPostsLoading(false);
//     } catch (error) {
//       console.error('Error fetching posts data:', error);
//       setError('Failed to load posts. Please try again later.');
//       setIsPostsLoading(false);
//     }
//   };

//   const fetchFavoritePosts = async () => {
//     try {
//       const favoritePostIdsResponse = await axios.get(`${USERS_API}/${userId}/favoritePostIds`);
//       const favoritePostIds = favoritePostIdsResponse.data;

//       const postsResponse = await axios.get(POSTS_API);
//       const allPosts = postsResponse.data;
      
//       const favoritePosts = allPosts.filter(post => favoritePostIds.includes(post.id));
//       setFavoritePosts(favoritePosts);
//     } catch (error) {
//       console.error('Error fetching favorite posts:', error);
//       setError('Failed to load favorite posts. Please try again later.');
//     }
//   };
  
//   const removeFavorite = async (postId) => {
//     try {
//       await axios.delete(`${USERS_API}/${userId}/favoritePostIds/${postId}`);
//       setFavoritePosts(prevPosts => prevPosts.filter(post => post.id !== postId));
//       setUser(prevUser => ({
//         ...prevUser,
//         favoritePostIds: prevUser.favoritePostIds.filter(id => id !== postId)
//       }));
//       console.log('Favorite removed successfully');
//     } catch (error) {
//       console.error('Error removing favorite:', error);
//     }
//   };

  
//   const renderProfile = () => {
//     if (isLoading) {
//       return <div>Loading user data...</div>;
//     }

//     if (error) {
//       return <div className="error-message">{error}</div>;
//     }

//     if (!user) {
//       return <div>Error loading user data. Please try again later.</div>;
//     }

//     const displayName = user.UserName ? `${user.UserName.first} ${user.UserName.last}` : user.username || 'User';

    
//     return (
//       <div className="user-profile">
//         {isEditing ? (
//           <EditProfileForm
//             user={user}
//             onUpdateProfile={(updatedUser) => {
//               setUser(updatedUser);
//               setIsEditing(false);
//             }}
//             onCancel={() => setIsEditing(false)}
//           />
//         ) : (
//           <>
//             <img 
//               src={user.profilePicture || './img/user1.png'} 
//               alt={displayName} 
//               className="profile-picture" 
//             />
//             <h2>Welcome, {displayName}!</h2>
//             <p>{user.bio}</p>
//             <p>Email: {user.email}</p>
//             <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
//             <div className="social-links">
//               {Object.entries(user.socialMedia || {}).map(([platform, handle]) => (
//                 <a key={platform} href={`https://${platform}.com/${handle}`} target="_blank" rel="noopener noreferrer">
//                   {platform}
//                 </a>
//               ))}
//             </div>
//             <button onClick={() => setIsEditing(true)}>Edit Profile</button>
//           </>
//         )}
//       </div>
//     );
//   };

//   const renderPosts = () => (
//     <div className="user-posts">
//       <h3>Your Posts</h3>
//       <button onClick={() => navigate('/new-post')} className="btn btn-primary">Create New Post</button>
//       {isPostsLoading ? (
//         <div>Loading posts...</div>
//       ) : error ? (
//         <div className="error-message">{error}</div>
//       ) : posts.length > 0 ? (
//         posts.map(post => (
//           <div key={post.id} className="post-item">
//             <h4>{post.title}</h4>
//             <div className="post-images">
//         {post.images.map((image, index) => (
//           <img
//             key={index}
//             src={image}
//             alt={`Post ${index + 1}`}
//             // style={{width:'100px', height:'100px', objectFit:'cover'}}
//           />
//         ))}
//       </div>
//             <p>{post.content.substring(0, 100)}...</p>
//             <button onClick={() => navigate(`/edit-post/${post.id}`)} className="btn btn-secondary">Edit</button>
//           </div>
//         ))
//       ) : (
//         <p>You haven't created any posts yet.</p>
//       )}
//     </div>
//   );


//   const renderFavoritePosts = () => {
//     const handleRemoveFavorite = (postId) => {
//       if (window.confirm("Are you sure you want to remove this post from your favorites?")) {
//         removeFavorite(postId);
//       }
//     };

//     return (
//       <div className="favorite-posts">
//         <h3>Favorite Posts</h3>
//         {favoritePosts.length > 0 ? (
//           <ul>
//             {favoritePosts.map((post) => (
//               <li key={post.id}>
//                 <h4>{post.title}</h4>
//                 <p>By: {post.author.Uname}</p>
//                 <button onClick={() => navigate(`/${post.id}`)} className="btn btn-secondary">View Post</button>
//                 <button onClick={() => handleRemoveFavorite(post.id)} className="btn btn-secondary">Remove Favorite</button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No favorite posts found. Start exploring and save your favorite posts!</p>
//         )}
//       </div>
//     );
//   };

//   const renderSavedDestinations = () => (
//     <div className="saved-destinations">
//       <h3>Saved Destinations</h3>
//       {user && user.savedDestinations && user.savedDestinations.length > 0 ? (
//         <ul>
//           {user.savedDestinations.map((destination, index) => (
//             <li key={index} onClick={() => handleCityClick(destination)}>
//               {destination}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No saved destinations found. Start exploring and save your favorite places!</p>
//       )}
//     </div>
//   );

//   const handleCityClick = (destination) => {
//     navigate(`/destinations`);
//   };

//   if (isLoading) {
//     return <div>Loading dashboard...</div>;
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   return (
//     <div className="dashboard-container">
//       {user && (
//         <>
//           <div className="dashboard-tabs">
//             <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>Profile</button>
//             <button onClick={() => setActiveTab('posts')} className={activeTab === 'posts' ? 'active' : ''}>Posts</button>
//             <button onClick={() => setActiveTab('favoritePosts')} className={activeTab === 'favoritePosts' ? 'active' : ''}>Favorite Posts</button> 
//             <button onClick={() => setActiveTab('savedDestinations')} className={activeTab === 'savedDestinations' ? 'active' : ''}>Saved Destinations</button>
//           </div>
//           <div className="dashboard-content">
//             {activeTab === 'profile' && renderProfile()}
//             {activeTab === 'posts' && renderPosts()}
//             {activeTab === 'favoritePosts' && renderFavoritePosts()}
//             {activeTab === 'savedDestinations' && renderSavedDestinations()}
//           </div>
//         </>
//       )}
     
//     </div>
//   );
// };


// export default UserDashboard;