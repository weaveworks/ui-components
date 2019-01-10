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
  },
};

describe('webpack LocalModuleProxy', () => {
  let proxy;
  let spy;

  beforeEach(() => {
    spy = createSpy();
    mockResolver.doResolve = spy;
    proxy = new LocalModuleProxy({
      enabled: true,
      moduleName: 'foo',
      path: `${process.cwd()}/tmp/foo.js`,
    });
  });
  it('resolves a module request to another directory', () => {
    proxy.apply(mockResolver);
    mockResolver.simulate({
      directory: false,
      path: 'myfile.js',
      query: null,
      request: 'foo',
    });
    expect(spy).toHaveBeenCalledWith(
      ['file'],
      {
        directory: false,
        path: 'myfile.js',
        query: null,
        request: `${process.cwd()}/tmp/foo.js`,
      },
      stub
    );
  });
  it('only runs if enabled', () => {
    proxy = new LocalModuleProxy({
      enabled: false,
      moduleName: 'foo',
      path: `${process.cwd()}/tmp/foo.js`,
    });
    proxy.apply(mockResolver);
    mockResolver.simulate({
      directory: false,
      path: 'myfile.js',
      query: null,
      request: 'foo',
    });
    expect(spy).toNotHaveBeenCalled();
  });
  it('proxies a list of modules', () => {
    proxy = new LocalModuleProxy({
      enabled: true,
      modules: {
        bar: `${process.cwd()}/tmp/bar.js`,
        foo: `${process.cwd()}/tmp/foo.js`,
      },
    });
    proxy.apply(mockResolver);
    mockResolver.simulate({
      directory: false,
      path: 'myFoo.js',
      query: null,
      request: 'foo',
    });
    expect(spy).toHaveBeenCalledWith(
      ['file'],
      {
        directory: false,
        path: 'myFoo.js',
        query: null,
        request: `${process.cwd()}/tmp/foo.js`,
      },
      stub
    );
    mockResolver.simulate({
      directory: false,
      path: 'myBar.js',
      query: null,
      request: 'bar',
    });
    expect(spy).toHaveBeenCalledWith(
      ['file'],
      {
        directory: false,
        path: 'myBar.js',
        query: null,
        request: `${process.cwd()}/tmp/bar.js`,
      },
      stub
    );
  });
});
