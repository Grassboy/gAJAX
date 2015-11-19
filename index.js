var prefix = 'gAJAX-';
var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var Request = require("sdk/request").Request;

pageMod.PageMod({
	include: "*",
	contentScriptFile: data.url("content.js"),
	onAttach: function(worker){
		worker.port.on(prefix+"request", function(event_id, options){
            var args = {
				url: options.url,
				onComplete: function (response) {
                    var response_obj;
                    //tricky: if pass response variable back directly, content script can not get the content...
                    response_obj = {
                        url: response.url,
                        text: response.text,
                        status: response.status,
                        statusText: response.statusText,
                        json: JSON.parse(JSON.stringify(response.json)),
                        headers: JSON.parse(JSON.stringify(response.headers))
                    };
					worker.port.emit(prefix+"response", event_id, response.text, response_obj);
				}
			};
            if(options.data) {
                args.content = options.data;
            }
            ['headers', 'contentType', 'overrideMimeType', 'anonymous'].forEach(function(attr){
                if(options[attr] !== undefined) {
                    args[attr] = options[attr];
                }
            });
            switch((options.type && options.type.toLowerCase())) {
            case "post":
			    Request(args).post();
                break;
            default:
			    Request(args).get();
            }
		});
		worker.port.emit(prefix+"init");
	}
});
