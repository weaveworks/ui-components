/* eslint-disable import/no-duplicates, no-duplicate-imports */
import expect from 'expect';
import fs from 'fs';
import _ from 'lodash';

import * as WeaveComponents from './index';
import { MenuItem } from './index';

function getFiles(path) {
  return fs.readdirSync(path).filter(d => !/^\.|index|example|test/.test(d));
}

describe('index', () => {
  it('should contain the components', () => {
    expect(WeaveComponents).toExist();
    expect(WeaveComponents.Button).toExist();
  });
  it('should contain all components from a directory', () => {
    expect(WeaveComponents.Grid).toExist();
    expect(WeaveComponents.GridColumn).toExist();
  });
  it('exports a non-default component', () => {
    expect(MenuItem).toExist();
  });
  it('should export all the components from "src/components"', () => {
    const componentsDir = './src/components';
    const files = getFiles(componentsDir);
    _.each(files, (f) => {
      expect(WeaveComponents[f]).toExist(
        `${f} module is missing. Did you export it from "src/components/index.js"?`
      );
    });
  });
});
