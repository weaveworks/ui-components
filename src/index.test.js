import expect from 'expect';

import * as WeaveComponents from './index';


describe('index', () => {
  it('should contain the components', () => {
    expect(WeaveComponents).toExist();
    expect(WeaveComponents.Button).toExist();
  });
  it('should contain all components from a directory', () => {
    expect(WeaveComponents.Grid).toExist();
    expect(WeaveComponents.GridColumn).toExist();
  });
});
