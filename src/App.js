import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from './components/About';
import BlogPostForm from './components/BlogPostForm';
import BlogPostPage from './components/BlogPostPage';
import CategoryPosts from './components/CategoryPosts'; // Add this import
import Contact from './components/Contact';
import Destinations from './components/Destinations';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import { Login, Register } from './components/Login';
import NavBar from './components/NavBar';
import SearchResults from './components/SearchResults';
import UserDashboard from './components/UserDashboard';
import './fontawesome';
import './styles/App.css';



function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      setUser(null);
      window.alert('Logged out!');
      localStorage.removeItem('user');
    }
  };

  return (
    <Router>
      <div className="App">
      
        <NavBar user={user} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/new-post" element={user ? <BlogPostForm /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={user ? <UserDashboard userId={user.id} /> : <Navigate to="/login" />} />
            <Route path="/" element={<Homepage user={user}/>} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/:postId" element={user ? <BlogPostPage currentUser={user.id}/> : <Navigate to="/login"/>} /> 
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
            <Route path="/destinations/:city" element={<Destinations />} />
            <Route path="/category/:category" element={<CategoryPosts />} /> {/* Add this new route */}
            {/* <Route path="/:postId" element={<BlogPost user={user}/>} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
