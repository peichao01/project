#!/usr/local/bin/node


var fs = require('fs'),
	startup = require('./startup_mac');

var args = process.argv;
/*
if(args[0] == 'node')
	args = args.splice(1);
*/
//args[0]: node
//args[1]: this file name
args = parseArgs(args.splice(2));

var cmd = {
	'help': '-h',
	'start': '-s',
	'daemon': '-d'
};

if(args.length === 0 || args.indexOf(cmd.help) >= 0){
	var manFile = fs.readFileSync(__dirname + '/man.txt').toString();
	console.log(manFile);
	process.exit(0);
}

if(args.indexOf(cmd.start) >= 0){
	console.log('starting...');
	var params = {
		autoread: args.autoread === 'false' ? false : true 
	};
	startup.init(params);
}

function parseArgs(args){
	args.forEach(function(arg, i){
		var match = arg.match(/^--(\w+)=(.+)$/);
		if(match){
			args[match[1]] = match[2];
		}
	});
	return args;
}
