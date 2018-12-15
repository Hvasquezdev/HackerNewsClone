import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Table from '../Table/index';

describe('Table', () => {

  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
    ],
  };

  it('table renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table {...props} />, div)
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Table {...props} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
