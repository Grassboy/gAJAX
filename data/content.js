var prefix = 'gAJAX-';
var postfix = '';
var eventQueue = [];
self.port.on(prefix+"init", function(){
	var gAJAX = function(options, callback){
		if(unsafeWindow["gAJAX"+postfix] !== gAJAX){
			return;
		}
		event_id = "t"+(new Date()).getTime()+Math.random();
		if(arguments.length !== 2){
			throw "gAJAX 使用方式：gAJAX(options, callback) 其中 options 類似 jQuery.ajax(options), 但要把 success callback 當第二個參數，options 參數不支援 options.success，且不支援 then 機制...";
            return;
		}
        //tricky: if we set options.success as a callback function, it will be ignored in content script
		eventQueue[event_id] = callback;
		self.port.emit(prefix+"request", event_id, options);
	};
	while(typeof unsafeWindow["gAJAX"+postfix] !== "undefined"){
		postfix = Math.random().toString().substr(-3);
	}
	unsafeWindow["gAJAX"+postfix] = gAJAX;
	if(postfix !== ""){
		alert( ["[gAJAX] gAJAX() 函數在這頁已經被定義了…\r\n",
			"請改用 'gAJAX", postfix, "()' 來存取剪貼簿資訊..."].join(''));
	}
	self.port.on(prefix+"response", function(event_id, result, response){
		eventQueue[event_id].call(this, result, response);
		delete eventQueue[event_id];
	});
});
