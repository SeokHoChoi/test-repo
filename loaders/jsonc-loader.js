const stripJsonComments = require('strip-json-comments');

module.exports = function (source) {
  // JSONC 주석을 제거하고 순수 JSON으로 변환
  const jsonWithoutComments = stripJsonComments(source);
  return `module.exports = ${jsonWithoutComments};`;
};
