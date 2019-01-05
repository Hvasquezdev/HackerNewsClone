import React, { Component } from 'react';
import propTypes from 'prop-types';
import { sortBy } from 'lodash';
import './index.css';

import Button from '../Button';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const Sort = ({ sortKey, onSort, activeSortKey, children }) => {
  const sortClass = ['button is-text has-text-weight-bold has-text-dark'];
    if (sortKey === activeSortKey) {
    sortClass.push('has-text-success');
  }

  return (
    <Button 
      onClick={() => onSort(sortKey)}
      className={sortClass.join(' ')}
    >
      {children}
    </Button>
  );
}

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE'
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    if(sortKey === this.state.sortKey) {
      this.setState({ sortKey: 'NONE' });
    } else {
      this.setState({ sortKey });
    }
  }

  render() {
    const { list, onDismiss } = this.props;
    const { sortKey } = this.state;

    const largeColumn = { width: '40%' };
    const midColumn = { width: '30%' };
    const smallColumn = { width: '10%' };

    return (
      <table className="table is-hoverable is-fullwidth is-striped">
        <thead>
          <tr>
            <th>
              <Sort
                sortKey={ 'TITLE' }
                onSort={ this.onSort }
                activeSortKey={ sortKey }
              >
                Title
              </Sort>
            </th>
            <th>
              <Sort
                sortKey={ 'AUTHOR' }
                onSort={ this.onSort }
                activeSortKey={ sortKey }
              >
                Author
              </Sort>
            </th>
            <th>
              <Sort
                sortKey={ 'COMMENTS' }
                onSort={ this.onSort }
                activeSortKey={ sortKey }
              >
                Comments
              </Sort>
            </th>
            <th>
              <Sort
                sortKey={ 'POINTS' }
                onSort={ this.onSort }
                activeSortKey={ sortKey }
              >
                Points
              </Sort>
            </th>
            <th>
              <button className="button is-text has-text-weight-bold has-text-dark">
                Archive
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            SORTS[sortKey] (list).map( item => 
              <tr key={item.objectID} className="table-row">
                <td style={largeColumn}>
                  <a href={item.url}>{item.title}</a>
                </td>
                <td style={midColumn}>
                  {item.author}
                </td>
                <td style={smallColumn}>
                  {item.num_comments}
                </td>
                <td style={smallColumn}>
                  {item.points}
                </td>
                <td style={smallColumn}>
                  <Button
                    onClick={() => onDismiss(item.objectID)}
                    type="button"
                    className="button is-warning"
                  >
                    Dismiss
                  </Button>
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  list: propTypes.array.isRequired,
  onDismiss: propTypes.func.isRequired
};

export default Table;