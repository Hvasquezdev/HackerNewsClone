import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];

const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      list,
      searchTerm: '',
      greetings: 'Hello World!'
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDimiss = this.onDimiss.bind(this);
  }

  onDimiss(id) {
    const updatedList = this.state.list.filter(item => item.objectID !== id);
    this.setState({list: updatedList});
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value})
  }

  render() {
    const { list, searchTerm } = this.state;

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
            list={list}
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