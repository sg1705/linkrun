
'use strict';

const path = require(`path`);

module.exports = {
  test: `linkrun`,
  cwd: path.resolve(path.join(__dirname, `../`)),
  cmd: `node`,
  args: [`server.js`],
  port: 8082,
  msg: `linkrun`
};
