var sys = require('sys');
var child_process = require('child_process');
var exec = child_process.exec;

var child;

//var copyCommand = 'pbcopy';
var cmd = {
	copy: 'pbcopy',
	paste: 'pbpaste',
	searchWord: function(word){
		return 'python -m webbrowser -t http://www.iciba.com/' + word;
	}
};

var clipboard_str = '';

//不知道什么办法获取系统的复制剪切事件，只能轮询了
setInterval(function(){
	child = exec(cmd.paste, function(error, stdout, stderr){
		if(error !== null){
			console.log('exec error: ' + error);
		}
		//sys.print('stdout: ' + stdout);
		if(stdout != clipboard_str){
			clipboard_str = stdout;
			console.log(clipboard_str);
			//只能是英文字母和空格
			//if(!stdout.match(/^[a-zA-Z\s+]$/)) return;
			//只能是ascii 字符
			if(!allIsAscii(stdout)) return;
			exec(cmd.searchWord(stdout), function(error, _out, _err){
				if(error !== null){
					console.log('search '+stdout+' failed: ' + error);
				}
			});
		}
	});
}, 100);

function allIsAscii(str){
	var re = true;
	for(var i = 0, len = str.length; i<len; i++){
		if(str[i].charCodeAt() >= 256){
			re = false;
			break;
		}
	}
	/*str.split('').forEach(function(c, i, arr){
		if(c.charCodeAt() >= 256) re = false;
	});*/
	return re;
}
