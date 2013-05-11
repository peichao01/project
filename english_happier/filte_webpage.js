var jsdom = require('jsdom'),
	fs = require('fs'),
	exec = require('child_process').exec,
	async = require('async');

var reg_mp3 = /http.*\.mp3/;

var jquery = fs.readFileSync(__dirname + '/jquery.js').toString();

var getDownloadCmd = function(url, outputname){
	var cmd;
	if(outputname){
		cmd = 'curl ' + url + ' -o ' + outputname;
	}else{
		cmd = 'curl -O ' + url;
	}
	//console.log('download cmd: ' + cmd);
	return cmd;
};

exports.getAudio = function(word, icibaUrl, cb, outputDir){
	//dir 不能带最后一个斜杠
	outputDir = (outputDir || __dirname) + '/';
	word = word.trim(); 
	jsdom.env({
		html: icibaUrl,
		src: [jquery],
		done: function(errors, window){
			var $ = window.$;
			var wrapNode = $('#main_box .prons');
			var ukNode = wrapNode.find('.eg:eq(0) a'),
				usaNode = wrapNode.find('.eg:eq(1) a').eq(0);
			var usaMp3, ukMp3, usaFile, ukFile;
			if(usaNode.length){
				usaMp3 = usaNode.attr('onclick').match(reg_mp3)[0];
				usaFile = outputDir + word + '_usa.mp3';
			}
			if(ukNode.length){
				ukMp3 = ukNode.attr('onclick').match(reg_mp3)[0];
				ukFile = outputDir + word + '_uk.mp3';
			}
			async.auto({
				downUsa: function(cb){
					if(usaMp3){
						var cmd = getDownloadCmd(usaMp3, usaFile);
						exec(cmd, function(err, stdout, stderr){
							if(err!== null)
								console.log('download ' + usaMp3 + ' failed.');
							cb();
						});
					}else
						cb();
				}, 
				downUk: function(cb){
					if(ukMp3){
						var cmd = getDownloadCmd(ukMp3, ukFile);
						exec(cmd, function(err, stdout, stderr){
							if(err!== null)
								console.log('download ' + ukMp3 + ' failed.');
							cb();
						});
					}else
						cb();
				}
			}, function(err, values){
				cb(usaFile, ukFile);
			});
		}
	});
}
