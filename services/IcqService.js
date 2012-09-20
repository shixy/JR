(function($,$R){
	
	function IcqService(){
		
	}
	
	IcqService.prototype  = new $R.Service();
	
	$.extend(IcqService.prototype,{
		init : function(){
			if($R.isOffline){
				this.icqModel = $R.createModel('IcqOfflineModel');
			}else{
				this.icqModel = $R.createModel('IcqModel');
			}
			this.icqOfflineModel = $R.createModel('IcqOfflineModel');
		},
		
		sendMsg : function(msgBody,cb){
			this.init();
			this.icqModel.sendMsg(msgBody,cb);
		},
		getAllMsg : function(cb){
			this.init();
			this.icqModel.getAllMsg(cb);
		},
		delMsg : function(msgId,cb){
			this.icqOfflineModel.delMsg(msgId,cb);
		},
		updateMsg : function(msgBody,cb){
			this.icqOfflineModel.updateMsg(msgBody);
		},
		getLocalMsg : function(cb){
			return this.icqOfflineModel.getAllMsg(cb);
		},
		syncMsg : function(msgId,cb){
			var msgBody = this.icqOfflineModel.getMsgById(msgId);
			this.sendMsg(msgBody,cb);
		}
		
	});
	
	$R.addService('IcqService',new IcqService());
	
})(jQuery,JR);