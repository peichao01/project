var sys = require('sys');
var child_process = require('child_process');
var filter = require('./filte_webpage');
var exec = child_process.exec;

var child;

//var copyCommand = 'pbcopy';
var cmd = {
	copy: 'pbcopy',
	paste: 'pbpaste',
	getIcibaUrl: function(word){
		var url = 'http://www.iciba.com/' + encodeURI(word);
		return url.replace(/\s/g, '_');
	},
	searchWord: function(word){
		return 'python -m webbrowser -t ' + this.getIcibaUrl(word);
	},
	playAudio: function(filepath){
		return 'afplay ' + filepath;
	}
};

var clipboard_str;
var first_time = true;

exports.init = function(params){

//不知道什么办法获取系统的复制剪切事件，只能轮询了
setInterval(function(){
	child = exec(cmd.paste, function(error, stdout, stderr){
		if(error !== null){
			console.log('exec error: ' + error);
		}
		//sys.print('stdout: ' + stdout);
		//第一次启动，不读出来
		if(first_time){
			first_time = false;
			console.log('the first search should not be: ' + stdout + '.');
			clipboard_str = stdout;
			return;
		}
		if(stdout != clipboard_str){
			clipboard_str = stdout;
			if(!isAvaliableWord(stdout)) return;
			console.log(clipboard_str);
			//只能是英文字母和空格
			//if(!stdout.match(/^[a-zA-Z\s+]$/)) return;
			//只能是ascii 字符
			exec(cmd.searchWord(stdout), function(error, _out, _err){
				if(error !== null){
					console.log('search '+stdout+' failed: ' + error);
				}
			});
			
			if(params.autoread){
				filter.getAudio(stdout, cmd.getIcibaUrl(stdout), function(usa, uk){
					//exec();
					console.log('us: ' + usa+'\nuk: '+uk);
					if(usa)
						exec(cmd.playAudio(usa));
					else if(uk)
						exec(cmd.playAudio(uk));
				}, __dirname + '/mp3');
			}
		}
	});
}, 100);

};

function isAvaliableWord(str){
	var re = true;
	for(var i = 0, len = str.length; i<len; i++){
		var c = str[i], ascii = c.charCodeAt();
		//if(c.charCodeAt() >= 256 || c=='/'){
		//特殊符号去除
		if(ascii >= 33 && ascii <= 64){
			console.log('character not support: ', c, ascii);
			re = false;
			break;
		}
	}
	/*str.split('').forEach(function(c, i, arr){
		if(c.charCodeAt() >= 256) re = false;
	});*/
	return re;
}
