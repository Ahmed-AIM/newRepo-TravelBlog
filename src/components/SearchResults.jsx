import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BlogPost from './BlogPost';
import { POSTS_API } from '../apiConfig';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(POSTS_API);
        const data = await response.json();
        const filteredPosts = data.filter(post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (Array.isArray(post.Destination) 
            ? post.Destination.some(dest => dest.toLowerCase().includes(searchQuery.toLowerCase()))
            : post.Destination.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setSearchResults(filteredPosts);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  return (
    <div className="search-results">
      <h2>Search Results for "{searchQuery}"</h2>
      {searchResults.length > 0 ? (
        searchResults.map(post => <BlogPost key={post.id} post={post} />)
      ) : (
        <p>No results found for "{searchQuery}"</p>
      )}
    </div>
  );
};

export default SearchResults;
