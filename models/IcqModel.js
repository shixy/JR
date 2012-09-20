(function($,$R){
	
	function IcqModel(){};
	
	IcqModel.prototype = new $R.Model();
	
	$.extend(IcqModel.prototype,{
		sendMsg : function(msgBody,cb){
			//alert('调用服务端接口保存(暂未实现接口)！');
			cb(msgBody);
		},
		getAllMsg : function(cb){
			var data = [
				        {"msg":"服务端数据1","receiver":"滕腾","sender":"shixy","msgId":"icq1"},
				        {"msg":"服务端数据2","receiver":"shixy","sender":"滕腾","msgId":"icq2"},
				        {"msg":"服务端数据3","receiver":"滕腾","sender":"shixy","msgId":"icq3"}
				];
			cb(data);
		}
	});
	
	$R.addModel('IcqModel',IcqModel);
	
})(jQuery, JR);