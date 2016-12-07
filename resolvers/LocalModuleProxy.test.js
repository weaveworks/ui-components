import expect, { createSpy } from 'expect';
import LocalModuleProxy from './LocalModuleProxy';

function stub() {}

// Mock that matches webpack resolver object.
const mockResolver = {
  plugin(name, callback) {
    this.callback = callback;
  },
  simulate(req) {
    this.callback.call(this, req, stub);
  }
};

describe('webpack LocalModuleProxy', () => {
  let proxy, spy;

  beforeEach(() => {
    spy = createSpy();
    mockResolver.doResolve = spy;
    proxy = new LocalModuleProxy({
      enabled: true,
      moduleName: 'foo',
      path: `${process.cwd()}/tmp/foo.js`
    });
  });
  it('resolves a module request to another directory', () => {
    proxy.apply(mockResolver);
    mockResolver.simulate({path: 'myfile.js', request: 'foo', query: null, directory: false});
    expect(spy).toHaveBeenCalledWith(['file'], {
      path: 'myfile.js',
      request: `${process.cwd()}/tmp/foo.js`,
      query: null,
      directory: false
    }, stub);
  });
  it('only runs if enabled', () => {
    proxy = new LocalModuleProxy({
      enabled: false,
      moduleName: 'foo',
      path: `${process.cwd()}/tmp/foo.js`
    });
    proxy.apply(mockResolver);
    mockResolver.simulate({ path: 'myfile.js', request: 'foo', query: null, directory: false });
    expect(spy).toNotHaveBeenCalled();
  });
});
