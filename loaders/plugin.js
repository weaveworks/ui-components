/* eslint-disable prefer-arrow-callback, no-extra-bind */
const fs = require('fs');
const docgen = require('react-docgen');

function isUserComponent(resource) {
  const dirAry = __dirname.split('/');
  const projectDir = dirAry.slice(0, dirAry.length - 1);
  const componentsDir = 'src/components';
  const correctDir = resource.indexOf(`${projectDir.join('/')}/${componentsDir}`) !== -1;
  const notTestOrIndex = /^((?!test|index|example).)*$/.test(resource);
  return correctDir && notTestOrIndex;
}

function ReactDocsPlugin() {

}

ReactDocsPlugin.prototype.apply = function (compiler) {
  compiler.plugin('this-compilation', function (compilation) {
    compilation.plugin('normal-module-loader', function (loaderContext, module) {
      if (isUserComponent(module.resource)) {
        const raw = fs.readFileSync(module.resource, 'utf8');
        const doc = JSON.stringify(docgen.parse(raw), null, 2);
        const name = module.resource.split('/').pop().replace('.js', '');
        compilation.assets[`docs/${name}.json`] = {
          size: () => doc.length,
          source: () => doc
        };
      }
    });
  }.bind(this));
};

module.exports = ReactDocsPlugin;
