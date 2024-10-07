import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { USERS_API } from '../apiConfig';
import '../styles/Login.css';
import axios from 'axios';


const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    try {
      const response = await fetch(USERS_API);
      const users = await response.json();
      
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
      
      
      if (user) {
        
        onLogin(user);

        navigate('/dashboard');

      } else {
        setError('Invalid Username or password');

        alert("Invalid Username or password");
      }
    } catch (error) {
      setError('An error occurred. Please try again.');

      alert("An error occurred. Please try again.")
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>

    </div>
  );
};


function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: 0, // We'll generate this when submitting
    username: '',
    UserName: {
      first: '',
      last: '',
    },
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: ''
      
    },
    favoritePostIds: []
  });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'UserName.first' || name === 'UserName.last') {
      const [parent, child] = name.split('.');
      setFormData(prevState => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value
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
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      // Fetch all users to determine the next ID
      const usersResponse = await axios.get(USERS_API);
      const users = usersResponse.data;
      const nextId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;

      // Prepare the data to be sent, excluding confirmPassword
      const dataToSend = {
        ...formData,
        id: nextId
      };
      delete dataToSend.confirmPassword;

      const response = await axios.post(USERS_API, dataToSend);
      // Handle successful registration
      navigate('/login');
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
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
        <div className='register-username'>
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
        <div className='register-firstname'>
          <label htmlFor="UserName.first">First Name:</label>
          <input
            type="text"
            id="UserName.first"
            name="UserName.first"
            value={formData.UserName.first}
            onChange={handleChange}
            required
          />
        </div>
        <div className='register-lastname'>
          <label htmlFor="UserName.last">Last Name:</label>
          <input
            type="text"
            id="UserName.last"
            name="UserName.last"
            value={formData.UserName.last}
            onChange={handleChange}
            required
          />
        </div>
        <div className='register-email'>
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
        <div className='register-password'>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className='register-confirm-password'>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className='register-bio'>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
        {Object.entries(formData.socialMedia).map(([platform, handle]) => (
          <div key={platform} className={`register-${platform}`}>
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
        <button type="submit">Register</button>
        {error && <p className="error">{error}</p>}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export { Login, Register };

// export default Login;


//================================other component===========================================

// import React, { useState } from 'react';
// import axios from 'axios';

// function Login() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     firstName: '',
//     lastName: '',
//   });
//   const [error, setError] = useState('');

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (isLogin) {
//       // Handle login logic here
//     } else {
//       try {
//         const response = await axios.post('/api/users/register', formData);
//         console.log('Registration successful:', response.data);
//         // Redirect to login or dashboard
//       } catch (error) {
//         setError(error.response?.data?.message || 'Registration failed');
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>{isLogin ? 'Login' : 'Register'}</h2>
//       <form onSubmit={handleSubmit}>
//         {!isLogin && (
//           <>
//             <input
//               type="text"
//               name="firstName"
//               placeholder="First Name"
//               value={formData.firstName}
//               onChange={handleInputChange}
//               required
//             />
//             <input
//               type="text"
//               name="lastName"
//               placeholder="Last Name"
//               value={formData.lastName}
//               onChange={handleInputChange}
//               required
//             />
//           </>
//         )}
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={formData.username}
//           onChange={handleInputChange}
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleInputChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleInputChange}
//           required
//         />
//         <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
//       </form>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <button onClick={() => setIsLogin(!isLogin)}>
//         {isLogin ? 'Need to register?' : 'Already have an account?'}
//       </button>
//     </div>
//   );
// }

// export default Login;


//================================== other component ====================================

// import React, { useState } from 'react';
// import axios from 'axios';
// import '../styles/Login.css';
// import { Link, useNavigate, useLocation } from 'react-router-dom';

// function Login({ onLogin }) {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();

//   const isLoginPage = location.pathname === '/login';

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isLoginPage) {
//         const response = await axios.post('API_ENDPOINTS_LOGIN', { email, password });
//         // Assuming the API returns a token
//         localStorage.setItem('token', response.data.token);
//         navigate('/dashboard');
//       } else {
//         await axios.post('API_ENDPOINTS_REGISTER', { username, email, password });
//         navigate('/login');
//       }
//     } catch (error) {
//       setError(isLoginPage ? 'Login failed. Please check your credentials and try again.' : 'Registration failed. Please try again.');
//     }
//   };

//   return (
//     <div className={isLoginPage ? "login" : "register"}>
//       <h2>{isLoginPage ? "Login" : "Register"}</h2>
//       <form onSubmit={handleSubmit}>
//         {!isLoginPage && (
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Username"
//             required
//           />
//         )}
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//         />
//         <button type="submit">{isLoginPage ? "Login" : "Register"}</button>
//       </form>
//       {error && <p className="error">{error}</p>}
//       <p>
//         {isLoginPage ? "Don't have an account? " : "Already have an account? "}
//         <Link to={isLoginPage ? "/register" : "/login"}>
//           {isLoginPage ? "Register" : "Login"}
//         </Link>
//       </p>
//     </div>
//   );
// }

// export default Login;