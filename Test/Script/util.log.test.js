/* eslint-env jest */

const { log } = require('../../util/log');

test('log info 1', () => {
  log.info('info');
});


test('log info 2', () => {
  process.env.Loglevel = 'Debug';
  log.info('info');
  delete process.env.Loglevel;
});
