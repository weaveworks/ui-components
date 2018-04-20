module.exports = class WeaveworksPartialImport {
  constructor() {
    return undefined;
  }
  apply(resolver) {
    resolver.plugin('module', function (request, callback) {
      if (/weaveworks-ui-components\/[A-Z].*$/.test(request.request)) {
        const module = request.request.split('/').pop();
        const req = {
          path: request.path,
          request: `${__dirname}/../lib/${module}.js`,
          query: request.query,
          directory: request.directory,
        };
        this.doResolve(['file'], req, callback);
      } else {
        callback();
      }
    });
  }
};
