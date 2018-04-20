module.exports = class LocalModuleProxy {
  constructor(opts) {
    this.opts = opts;
  }
  apply(resolver) {
    const self = this;
    resolver.plugin('module', function (request, callback) {
      const { moduleName, path, modules } = self.opts;
      const requestedModule = request.request;

      if (self.opts.enabled) {
        if (moduleName === requestedModule) {
          const proxyReq = {
            path: request.path,
            request: path,
            query: request.query,
            directory: request.directory,
          };
          this.doResolve(['file'], proxyReq, callback);
        } else if (modules && modules[requestedModule]) {
          const proxyReq = {
            path: request.path,
            request: modules[requestedModule],
            query: request.query,
            directory: request.directory,
          };
          this.doResolve(['file'], proxyReq, callback);
        } else {
          callback();
        }
      } else {
        callback();
      }
    });
  }
};
