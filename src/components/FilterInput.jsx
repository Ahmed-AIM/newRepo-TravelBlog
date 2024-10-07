import React from 'react';
import '../styles/FilterInput.css';

const FilterInput = ({ onFilterChange }) => {
  return (
    <div className="filter-input-container">
      <input
        type="text" style={{backgroundColor:'rgba(207, 202, 202, 0.308)'}}
        placeholder="Filter posts by title, tags, city..."
        onChange={(e) => onFilterChange(e.target.value)}
        className="filter-input"
      />
      <div className="filter-input-animation"></div>
    </div>
  );
};

export default FilterInput;