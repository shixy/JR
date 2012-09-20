(function( $, $R ){

	function IndexService(){
        //定义静态常量
    };
	
	IndexService.prototype  = new $R.Service();
	
	$.extend(IndexService.prototype,{
		
		init : function(){
			this.indexModel = $R.createModel('IndexModel');
		},
		
		getSummaryInfo : function(datacenterId){
		    var cb = this.getCallback(arguments);
		    if(datacenterId){
		        this.indexModel.getDatacenterSummaryInfo(datacenterId,cb);
		    }else{
		        this.indexModel.getSummaryInfo(cb);
		    }
		},

        getResTop5 : function(dcId){
            var cb = this.getCallback(arguments);
            var _cb = {};
            $.extend(_cb,cb,{
                success: function(data){
                    var chartOption = {
                        "chart": {
                        }
                    };
                    var newData = [];
                    var poolInfo = data.resourcePoolLoadInfo;
                    for(var i=0,len=poolInfo.length;i<len;i++){
                        newData.push({
                            label : poolInfo[i].resourcePoolName,
                            value : poolInfo[i].weight
                        });
                    }
                    chartOption.data = newData;
                    cb.success(chartOption);
                }
            });
            this.indexModel.getResTop5(dcId,_cb);
        },

        getHostTop5 : function(dcId){
            var cb = this.getCallback(arguments);
            this.indexModel.getHostTop5(dcId,cb);
        }
	});

	$R.addService('IndexService',new IndexService());
	
})( jQuery, JR );
