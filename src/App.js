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
      results: null,
      searchTerm: DEFAULT_QUERY,
      searchKey: '',
      greetings: 'Hello World!'
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const {hits, page} = result;
    const {searchKey, results} = this.state;

    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

    const updateHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      results: {
        ...results,
        [searchKey]: {
          hits: updateHits,
          page
        }
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
    this.setState({searchKey: searchTerm});

    if(this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const updatedHist = hits.filter(item => item.objectID !== id);
    this.setState(
      {
        results: { 
          ...results, 
          [searchKey]: {
            hits: updatedHist,
            page
          }
        }
      }
    );
  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    const {searchTerm, results, searchKey} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    if(!results) { return null; }

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

          { results &&
            <Table 
              list={list}
              pattern={searchTerm}
              onDismiss={this.onDismiss}
            />
          }

          <div className="interactions">
            <button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
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