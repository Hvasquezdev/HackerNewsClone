import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '15';

const PATH_BASE = 'http://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = '?query='
const PARAM_PAGE = '&page=';
const PARAM_HPP = '&hitsPerPage=';

const URL = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}`;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
      greetings: 'Hello World!'
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories(result) {
    const {hits, page} = result;
    console.log(page)
    const oldHits = page !== 0 ? this.state.result.hits : [];
    const updateHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      result: {
        hits: updateHits,
        page
      }
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${URL}${searchTerm}${PARAM_PAGE}${page}${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value})
  }

  onSearchSubmit(event) {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  onDismiss(id) {
    const updatedHist = this.state.result.hits.filter(item => item.objectID !== id);
    this.setState(
      {
        result: { ...this.state.result, hits: updatedHist }
      }
    );
  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    const {searchTerm, result} = this.state;
    const page = (result && result.page) || 0;

    if(!result) { return null; }

    return (
      <div className="page">
        <div className="interactions">
          <h1>{this.state.greetings}</h1>

          <hr />

          <Search 
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
            value={searchTerm}
          >
            Search
          </Search>

          <hr />

          { result &&
            <Table 
              list={result.hits}
              pattern={searchTerm}
              onDismiss={this.onDismiss}
            />
          }

          <div className="interactions">
            <button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
              More
            </button>
          </div>
        </div>
      </div>
    );
  }
}

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

const Table = ({ list, onDismiss}) => {
  const largeColumn = { width: '40%' };
  const midColumn = { width: '30%' };
  const smallColumn = { width: '10%' };
  return (
    <div className="table">
      {
        list.map( item => 
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>
              {item.author}
            </span>
            <span style={smallColumn}>
              {item.num_comments}
            </span>
            <span style={smallColumn}>
              {item.points}
            </span>
            <span style={smallColumn}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                type="button"
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        )
      }
    </div>
  );
}

const Button = ({ onClick, className, children }) => {
  return (
    <button
      onClick={onClick}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
}

export default App;