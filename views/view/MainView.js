(function( $, $R ){
	/**
	 * SPA(Single Page Application) 基础页面
	 * 处理模块跳转、404、登出等公共组件的事件
	 */
	function MainView(){
        this.userType = $.cookies.get('UTYPE');
        this.dcId = $.cookies.get('DCID');
        this.userId = $.cookies.get('UID');
		//初始化静态常量
		this.moduleTmplPath = {
			'home':'/home.tmpl',
			'workPlat':'/workPlatform.tmpl',
			'chart':'/chart.tmpl'
		};
	};
    MainView.prototype = new $R.View();
	$.extend(MainView.prototype,{
		//初始化页面元素事件
		init : function(){
            FusionCharts.setCurrentRenderer('javascript');
            this.container = $('#main');
            this.navEl = $('#current_nav');
            var username = $.cookies.get('UNAME');
            $('#userDisplay').text(username);
            $('#edit_user_el').toggle(function(){
                alert('show');
            },function(){
                alert('hide');
            });
            $('#logout_el').click(this.logout);
		},
        render : function(html,scope){
            var _this = this;
            var effectIn =  'drop';
            var effectOut = 'blind';
            if(this.container.text().length == 0){
                this.container.html(html);
                this.container.show(effectIn,500,function(){
                    if(scope && scope.afterRender)scope.afterRender();
                });
            }else{
                this.container.hide(effectOut,200,function(){
                    setTimeout(function(){
                        _this.container.html(html);
                        _this.container.show(effectIn,500,function(){
                            if(scope && scope.afterRender)scope.afterRender();
                        });
                    },200);
                })
            }
        },
        //高亮当前模块并更新导航信息
        hilightNav : function(moduleName){
            //TODO
        },
		logout : function(){
			alert('登出系统！');
            $.cookies.del('UID');
            window.location.href='/login.html';
		},
		pageError : function(){
			var _this = this;
			$R.processTmpl({
				tmplEId :'500Tmpl',
				success : function(result){
					_this.render(result);
				}
			});
		},
		pageNotFound : function(){
			var _this = this;
			$R.processTmpl({
				tmplEId :'404Tmpl',
				success : function(result){
					_this.render(result);
				}
			});
		},
        setNavName : function(name){
            this.navEl.html(name);
        }
	});
	$R.addView('MainView',new MainView());
})( jQuery, JR );
