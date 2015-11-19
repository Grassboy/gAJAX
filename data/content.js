var prefix = 'gAJAX-';
var postfix = '';
var eventQueue = {};
var checkHost = function(){
	var whiteLists = localPref.whiteList.split(",");
	var toRegExp = function(str){
		str = str.split("*");
		for(var i = 0, n = str.length; i < n; ++i){
			str[i] = str[i].replace(/([\/\.\?\*\+\^\$\[\]\\\(\)\{\}\-])/g, "\\$1");
		}
		str = str.join(".*");
		return new RegExp("^"+str+"$");
	};
	for(var i = 0, n = whiteLists.length; i < n; ++i){
		var hostRegExp = toRegExp(String.trim(whiteLists[i]));
		if(hostRegExp.test(location.host)){
			return true;
		}
	}
	return false;
};
self.port.on(prefix+"init", function(pref){
	localPref = pref;
	var gAJAX = function(options, callback, authToken){
		if(unsafeWindow["gAJAX"+postfix] !== gAJAX){
			return;
		}
		event_id = "t"+(new Date()).getTime()+Math.random();
		if(arguments.length !== 2 && arguments.length !== 3){
			throw "gAJAX 使用方式：gAJAX(options, callback[, authKey]) 其中 options 類似 jQuery.ajax(options), 但要把 success callback 當第二個參數，options 參數不支援 options.success，且不支援 then 機制，authToken 可不指定，但若 authToken 與系統設定的相同，則無條件略過確認訊息";
            return;
		}
        if(
            localPref.showConfirm &&
            !checkHost() && 
            !(localPref.authToken !== "" && arguments[2] === localPref.authToken) &&
            !confirm("[gAJAX] 您確定要透過程式發佈跨網域的 ajax 請求？\r\n")
        ) throw "gAJAX 存取遭拒";
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
