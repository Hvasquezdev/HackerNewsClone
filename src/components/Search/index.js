import React, { Component } from 'react';
import propTypes from 'prop-types';
import './index.css';

class Search extends Component {
  componentDidMount() {
    if(this.input) {
      this.input.focus();
    }
  }

  render() {
    const {
      value,
      onChange,
      onSubmit,
      children
    } = this.props;

    return (
      <form onSubmit={ onSubmit }>
        { children } <input 
          type="text" 
          onChange={ onChange } 
          value={ value }  
          ref={ el => this.input = el }
        />
        <button 
          type="submit"
          className="searchButton"
        >
          { children }
        </button>
      </form>    
    );
  }
}

Search.propTypes = {
  value: propTypes.string,
  onChange: propTypes.func,
  onSubmit: propTypes.func,
  children: propTypes.node
};

export default Search;