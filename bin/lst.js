#!/usr/bin/env node

const yargs = require('yargs');
const ora = require('ora');
const { app } = require('../index');
const { init } = require('../lib/crawler');
const defaultConfig = require('../config');

const argv = yargs
  .version(getVersion())
  .usage('Usage: $0 -u username -p pwd')
  .option('username', {alias: 'u', describe: `leetCode's username`, string: true})
  .option('password', {alias: 'p', describe: `leetCode's password`, string: true})
  .option('config', {alias: 'c', describe: 'Specify file path, json or js file which return object that includes username and password at least'})
  .option('port', {alias: 't', describe: 'server port', string: true, default: '3000'})
  .option('headless', {alias: 'l', describe: 'Use headless browser', boolean: true, default: true})
  .help()
  .argv;

if (argv.username && argv.password) {
  startServer(Object.assign({}, defaultConfig, argv));
} else if (argv.config) {
  try {
    let config = require(argv.config);
    config = Object.assign(defaultConfig, config);
    startServer(config);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
} else {
  yargs.showHelp('log');
  process.exit(0);
}


function startServer (args) {
  const spinner = ora('Server starting...').start();
  app.listen(args.port, () => {
    spinner.succeed('Server start successed!');
  });
  init(args);
}

function getVersion() {
  const pkg = require('../package');
  return `${pkg.name}@${pkg.version}`;
}