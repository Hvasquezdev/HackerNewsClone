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
      onSubmit
    } = this.props;

    return (
      <form onSubmit={ onSubmit }>      
        <div className="field has-addons">
          <div className="control">
            <input 
              className="input is-success" 
              type="text" 
              onChange={ onChange } 
              value={ value }  
              ref={ el => this.input = el }
              placeholder="Find a topic"
            ></input>
          </div>
          <div className="control">
            <button className="button is-success">
              Search
            </button>
          </div>
        </div>
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