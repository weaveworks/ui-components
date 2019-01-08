module.exports = class LocalModuleProxy {
  constructor(opts) {
    this.opts = opts;
  }
  apply(resolver) {
    const self = this;
    resolver.plugin('module', function(request, callback) {
      const { moduleName, path, modules } = self.opts;
      const requestedModule = request.request;

      if (self.opts.enabled) {
        if (moduleName === requestedModule) {
          const proxyReq = {
            directory: request.directory,
            path: request.path,
            query: request.query,
            request: path,
          };
          this.doResolve(['file'], proxyReq, callback);
        } else if (modules && modules[requestedModule]) {
          const proxyReq = {
            directory: request.directory,
            path: request.path,
            query: request.query,
            request: modules[requestedModule],
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
