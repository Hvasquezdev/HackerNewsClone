import React from 'react';
import propTypes from 'prop-types';
import './index.css';

const Search = ({ value, onChange, onSubmit, children}) => {
  return (
    <form onSubmit={onSubmit}>
      {children} <input 
        type="text" 
        onChange={onChange} 
        value={value}  
      />
      <button 
        type="submit"
        className="searchButton"
      >
        {children}
      </button>
    </form>      
  );
}

Search.propTypes = {
  value: propTypes.string,
  onChange: propTypes.func,
  onSubmit: propTypes.func,
  children: propTypes.node
};

export default Search;