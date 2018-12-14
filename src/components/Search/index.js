import React from 'react';
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

export default Search;