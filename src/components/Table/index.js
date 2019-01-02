import React from 'react';
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
  const sortClass = ['button-inline'];
    if (sortKey === activeSortKey) {
    sortClass.push('button-active');
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

const Table = ({ list, sortKey, onSort, onDismiss }) => {
  const largeColumn = { width: '40%' };
  const midColumn = { width: '30%' };
  const smallColumn = { width: '10%' };
  return (
    <div className="table">
      <div className="table-header">
        <span style={{ width: '40%' }}>
          <Sort
            sortKey={ 'TITLE' }
            onSort={ onSort }
            activeSortKey={ sortKey }
          >
            Title
          </Sort>
        </span>

        <span style={{ width: '30%' }}>
          <Sort
            sortKey={ 'AUTHOR' }
            onSort={ onSort }
            activeSortKey={ sortKey }
          >
            Author
          </Sort>
        </span>

        <span style={{ width: '10%' }}>
          <Sort
            sortKey={ 'COMMENTS' }
            onSort={ onSort }
            activeSortKey={ sortKey }
          >
            Comments
          </Sort>
        </span>

        <span style={{ width: '10%' }}>
          <Sort
            sortKey={ 'POINTS' }
            onSort={ onSort }
            activeSortKey={ sortKey }
          >
            Points
          </Sort>
        </span>

        <span style={{ width: '10%' }}>
          Archive
        </span>
      </div>
    
      {
        SORTS[sortKey] (list).map( item => 
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

Table.propTypes = {
  list: propTypes.array.isRequired,
  onDismiss: propTypes.func.isRequired
};

export default Table;