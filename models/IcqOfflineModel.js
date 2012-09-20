(function($,$R){
	
	function IcqOfflineModel(){
		
	};
	
	IcqOfflineModel.prototype = new $R.Model();
	
	$.extend(IcqOfflineModel.prototype,{
		sendMsg : function(msgBody,callback){
			var msgs = localStorage['msg'];
			msgBody.msgId = this.genUid('icq');
			msgBody.status = 'offline';
			if(msgs){
				msgs = JSON.parse(msgs);
				msgs.push(msgBody);
				localStorage['msg'] = JSON.stringify(msgs);
			}else{
				var arr = [];arr.push(msgBody);
				localStorage['msg'] = JSON.stringify(arr);
			}
			callback(msgBody);
		},
		delMsg : function(msgId,callback){
			var msgs = JSON.parse(localStorage['msg']);
			var newMsgs;
			for(var i=0;i<msgs.length;i++){
				if(msgs[i].msgId == msgId){
					newMsgs = msgs.slice(0,i).concat(msgs.slice(i+1,msgs.length));
					break;	
				}
			}
			localStorage['msg'] = JSON.stringify(newMsgs);
			callback();
		},
		updateMsg : function(msgBody,callback){
			var msgs = JSON.parse(localStorage['msg']);
			for(var i=0;i<msgs.length;i++){
				if(msgs[i].msgId == msgBody.msgId){
					msg[i] = msgBody;
					break;	
				}
			}
			localStorage['msg'] = JSON.stringify(msgs);
			callback(msgBody);
		},
		getAllMsg : function(callback){
			var msgs = localStorage['msg'];
			var result = null;
			if(msgs){
				var arr = JSON.parse(msgs);
				if(arr.length == 0){
					result = null;
				}else{
					result = arr;
				}
			}
			callback(result);
		},
		getMsgById :function(msgId,callback){
			var msgs = JSON.parse(localStorage['msg']);
			var result;
			for(var i=0;i<msgs.length;i++){
				if(msgs[i].msgId == msgId){
					result = msgs[i];
					break;	
				}
			}
            callback( result);
		}
	});
	
	$R.addModel('IcqOfflineModel',IcqOfflineModel);
	
})(jQuery, JR);