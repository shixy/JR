(function($,$R){
	
	function LoginModel(){};

    LoginModel.prototype = new $R.Model();
	
	$.extend(LoginModel.prototype,{
		login : function(param,callback){
            var cfg = {
                url: '/login',
                data : param,
                callback : callback
            }
            this.get(cfg);
		},
        logout : function(callback){
            var cfg = {
                url: '/logout',
                callback : callback
            }
            this.get(cfg);
        }
	});
	
	$R.addModel('LoginModel',LoginModel);
	
})(jQuery, JR);