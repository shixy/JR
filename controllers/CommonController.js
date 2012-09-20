(function($,$R){
    /**
     * 处理公用的页面跳转
     */
	function CommonController(){
		//自动根据配置文件来装载路径
		this.autoLoadRoute('CommonController');
	};
	
	CommonController.prototype = new $R.Controller();
	
	$.extend(CommonController.prototype,{
        //首页
        home : function(){
            this.indexView = $R.getView('IndexView');
            this.indexView.render();
        },
		pageNotFound : function(){
			$R.mainView.pageNotFound();
		},
		pageError : function(){
			$R.mainView.pageError();
		}
		
	});
	
	$R.addController('CommonController', new CommonController());
	
})(jQuery, JR);