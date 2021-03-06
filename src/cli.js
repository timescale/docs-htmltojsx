#!/usr/bin/env node
'use strict';

var fs = require('fs');
var HTMLtoJSX = require('./htmltojsx.js');
var yargs = require('yargs');

function getArgs() {
  var args = yargs
    .usage(
      'Converts HTML to JSX for use with React.\n' +
      'Usage: $0 [-c ComponentName] file.htm'
    )
    .describe('className', 'Create a React component (wraps JSX in React.createClass call)')
    .alias('className', 'c')
    .boolean('e')
    .describe('e', 'Decide whether to wrap in module.exports')
    .boolean('g')
    .describe('g', 'Decide whether to format for grouping with other jsx files(i.e. no wrapper')
    .boolean('r')
    .describe('r', 'Decide whether to convert kebob to pascal case for React components')
    .boolean('k')
    .describe('k', 'Decide whether to keep case for all tags or switch to lowercase')
    .string('f')
    .describe('f', 'What to prefix each html node with (used with kebob to pascal case flag only)')
    .boolean('attr')
    .describe('attr', 'Handle braces vars in attributes')
    .help('help')
    .example(
      '$0 -c AwesomeComponent awesome.htm',
      'Creates React component "AwesomeComponent" based on awesome.htm'
    )
    .strict();

  var files = args.argv._;
  if (!files || files.length === 0) {
    console.error('Please provide a file name');
    args.showHelp();
    process.exit(1);
  }
  return args.argv;
}

function main() {
  var argv = getArgs();
  fs.readFile(argv._[0], 'utf-8', function(err, input) {
    if (err) {
      console.error(err.stack);
      process.exit(2);
    }
    var converter = new HTMLtoJSX({
      createClass: !!argv.className,
      outputClassName: argv.className,
      exports: argv.e && !argv.g,
      group: argv.g && !argv.e,
      lowercase: !argv.k,
      attributes: argv.attr,
      kebebToPascal: argv.r,
      prefix: argv.f,
    });
    var output = converter.convert(input);
    console.log(output);
  });
}

main();
