module.exports = class WeaveworksPartialImport {
  constructor() {
    return undefined;
  }
  apply(resolver) {
    resolver.plugin('module', function(request, callback) {
      if (/weaveworks-ui-components\/[A-Z].*$/.test(request.request)) {
        const module = request.request.split('/').pop();
        const req = {
          directory: request.directory,
          path: request.path,
          query: request.query,
          request: `${__dirname}/../lib/${module}.js`,
        };
        this.doResolve(['file'], req, callback);
      } else {
        callback();
      }
    });
  }
};
