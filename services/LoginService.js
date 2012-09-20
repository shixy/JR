/**
 * Desc:登录服务
 * User: walker
 * Date: 12-3-6
 * Time: 上午9:53
 */
(function( $, $R ){
    function LoginService(){ };
    LoginService.prototype  = new $R.Service();
    $.extend(LoginService.prototype,{

        init : function(){
            this.loginModel = $R.createModel('LoginModel');
        },

        //登录验证
        login : function(username,pwd){
            var param = {
                name : username,
                password : pwd,
                forced : false
            };
            this.loginModel.login(param,this.getCallback(arguments));
        },
        //登出
        logout : function(){
            this.loginModel.logout(this.getCallback(arguments));
        },
        //检查是否已经登录
        checkLogin : function(){

        }
    });
    $R.addService('LoginService',new LoginService());
})(jQuery, JR)