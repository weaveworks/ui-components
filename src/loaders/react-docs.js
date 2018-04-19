const docgen = require('react-docgen');

module.exports = function(content) {
  this.cacheable();
  this.value = content;
  try {
    const output = docgen.parse(content);
    output.name = this.resourcePath
      .split('/')
      .pop()
      .replace('.js', '');
    return `module.exports = ${JSON.stringify(output)}`;
  } catch (e) {
    return content;
  }
};

module.exports.seperable = true;
