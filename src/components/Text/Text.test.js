import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';

import theme from '../../../theme';
import Text from './Text';

describe('<Text />', () => {
  it('renders default', () => {
    const tree = renderer.create(<Text theme={theme} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renderes large', () => {
    const tree = renderer.create(<Text large theme={theme} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders bold', () => {
    const tree = renderer.create(<Text italic theme={theme} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders italic', () => {
    const tree = renderer.create(<Text large theme={theme} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders xl', () => {
    const tree = renderer.create(<Text xl theme={theme} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
