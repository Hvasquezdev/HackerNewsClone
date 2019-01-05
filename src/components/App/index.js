import React, { Component } from 'react';
import axios from 'axios';
import './index.css';

import Search from '../Search';
import Table from '../Table';

import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP
} from '../../constants';

const URL = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}`;
const Loading = () => <button className="button is-success is-loading" disabled>Loading</button>;
const ButtonWithLoading = ({ isLoading, ...rest }) => 
  isLoading 
    ? <Loading /> 
    : <button className="button is-success" { ...rest } />      

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;
  const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];
  const updatedHits = [
    ...oldHits,
    ...hits
  ];
  return {
    results: {
    ...results,
      [searchKey]: { hits: updatedHits, page }
    },
    isLoading: false
  };
};

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchTerm: DEFAULT_QUERY,
      searchKey: '',
      error: null,
      greetings: 'Hacker News Clone',
      isLoading: false
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
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });

    axios(`${URL}${searchTerm}${PARAM_PAGE}${page}${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({error}));
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
    this._isMounted = true;

    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillMount() {
    this._isMounted = false;
  }

  render() {
    const {searchTerm, results, searchKey, error, isLoading} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    if(!results) { return null; }

    return (
      <div className="container is-fluid">
        <div className="has-text-centered">
          <h1 className="title">{ this.state.greetings }</h1>

          <Search 
            onChange={ this.onSearchChange }
            onSubmit={ this.onSearchSubmit }
            value={ searchTerm }
          >
          </Search>

          { error 
            ? <div className="has-text-centered">
                <p>Something went wrong.</p>
              </div>
            
            : <Table 
                list={ list }
                pattern={ searchTerm }
                onDismiss={ this.onDismiss }
              />
          }

          <div className="has-text-centered">
            <ButtonWithLoading isLoading={ isLoading } onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
              More
            </ButtonWithLoading>
          </div>
        </div>
      </div>
    );
  }
}

export default App;