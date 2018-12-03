import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'http://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = '?query='
const URL = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}`;

const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
      greetings: 'Hello World!'
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDimiss = this.onDimiss.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({result});
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value})
  }

  onDimiss(id) {
    const updatedHist = this.state.result.hits.filter(item => item.objectID !== id);
    this.setState(
      {
        result: { ...this.state.result, hits: updatedHist }
      }
    );
  }

  componentDidMount() {
    const {searchTerm} = this.state;

    fetch(`${URL}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  render() {
    const {searchTerm, result} = this.state;

    if(!result) { return null; }

    return (
      <div className="page">
        <div className="interactions">
          <h1>{this.state.greetings}</h1>

          <hr />

          <Search 
            onChange={this.onSearchChange}
            value={searchTerm}
          >
            Search
          </Search>

          <hr />

          <Table 
            list={result.hits}
            pattern={searchTerm}
            onDimiss={this.onDimiss}
          />
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, children}) => {
  return (
    <form>
      {children} <input 
        type="text" 
        onChange={onChange} 
        value={value}  
      />
    </form>      
  );
}

const Table = ({ list, pattern, onDimiss}) => {
  const largeColumn = { width: '40%' };
  const midColumn = { width: '30%' };
  const smallColumn = { width: '10%' };
  return (
    <div className="table">
      {
        list.filter(isSearched(pattern)).map( item => 
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
                onClick={() => onDimiss(item.objectID)}
                type="button"
                className="button-inline"
              >
                Dimiss
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