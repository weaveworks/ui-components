
module.exports = class LocalModuleProxy {
  constructor(opts) {
    this.opts = opts;
  }
  apply(resolver) {
    const self = this;
    resolver.plugin('module', function (request, callback) {
      const { moduleName, path } = self.opts;
      if (self.opts.enabled && moduleName === request.request) {
        const proxyReq = {
          path: request.path,
          request: path,
          query: request.query,
          directory: request.directory,
        };
        this.doResolve(['file'], proxyReq, callback);
      } else {
        callback();
      }
    });
  }
};
