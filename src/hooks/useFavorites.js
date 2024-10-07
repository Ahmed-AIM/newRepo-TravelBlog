import { useState, useEffect } from 'react';
import axios from 'axios';
import { USERS_API } from '../apiConfig';


export const useFavorites = (user, postId) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user && Array.isArray(user.favoritePostIds)) {
      setIsFavorite(user.favoritePostIds.includes(postId));
    } else {
      setIsFavorite(false);
    }
  }, [user, postId]);

  const toggleFavorite = async () => {
    if (!user) return;

    try {
      const updatedUser = { ...user };
      
      if (!Array.isArray(updatedUser.favoritePostIds)) {
        updatedUser.favoritePostIds = [];
      }

      if (isFavorite) {
        updatedUser.favoritePostIds = updatedUser.favoritePostIds.filter(id => id !== postId);
      } else {
        updatedUser.favoritePostIds = [...updatedUser.favoritePostIds, postId];
      }

      await axios.put(`${USERS_API}/${updatedUser.id}`, updatedUser);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorites:', error);
      throw error;
    }
  };

  return { isFavorite, toggleFavorite };
};
