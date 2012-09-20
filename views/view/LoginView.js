/**
 * Desc:登录
 * User: walker
 * Date: 12-3-7
 * Time: 下午2:12
 */
(function($,$R){
    function LoginView(){};
    LoginView.prototype = new $R.View();
    $.extend(LoginView.prototype,{
        login : function(){
            var _this = this;
            var username = this.input_username.css('borderColor','#cccccc').val();
            var password = this.input_pwd.css('borderColor','#cccccc').val();
            if($.trim(username) == ''){
                this.input_username.css('borderColor','red').focus();
                this.lbl_err.text('请输入用户名！');
                return;
            }
            if($.trim(password) == ''){
                this.input_pwd.css('borderColor','red').focus();
                this.lbl_err.text('请输入密码！');
                return;
            }
            _this.btn_login .val('登录中...');
            $R.getService('LoginService').login(username,password,{
                success : function(userInfo){
                    _this.btn_login .val('登录成功');
                    _this.setCookies(userInfo);
                    window.location.href = "/"
                },
                error : function(e){
                    if(typeof e == 'object' && e.status){
                        switch(e.status){
                           case 503: _this.lbl_err.text('无法连接服务器');break;
                           case 404 : _this.lbl_err.text('找不到相关资源');break;
                           case 500 : _this.lbl_err.text('用户名或者密码错误');break;
                        }
                    }else{
                        _this.lbl_err.text('服务器发生错误！');
                    }
                    _this.btn_login .val('登录');
                }
            });
        },
        setCookies : function(userInfo){
            //TODO 需要对部分cookies进行base64或者MD5加密
            $.cookies.set('UID',userInfo.cloudUserInfo.id);
            $.cookies.set('UNAME',userInfo.cloudUserInfo.name);
            $.cookies.set('UTYPE',userInfo.cloudUserInfo.type);
            if(userInfo.cloudUserInfo.datacenter){
                $.cookies.set('DCID',userInfo.cloudUserInfo.datacenter.id);
            }


        },
        init : function(){
            var _this = this;
            this.input_username = $('#username');
            this.input_pwd = $('#password');
            this.lbl_err = $('#errmsg');
            this.btn_login = $('#login_submit');
            this.btn_login.click(function(){
                 _this.login();
            });
            $('#username,#password').keyup(function(e){
                e = window.event || e;
                if(e.keyCode == 13){
                    _this.login();
                }
            })
        }
    });
    $R.addView('LoginView',new LoginView());
})(jQuery,JR)
