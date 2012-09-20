/**
 * config  配置对应层的相对路径
 */
(function($,$R){
	$R.config = {
        //主承载页面view
        mainViewName : 'MainView',
		//各个层js文件存放目录
		basePath : {
			'models' : 'models',
			'controllers' : 'controllers',
			'services' : 'services',
			'views' : 'views/view',
			'templates' : 'views/tmpl'
		},
		
		//各个模块对应的path和方法 key为Controller名称
		routeMapping : {
            'MsgController' : [
                {path:'msg',handler : 'main'}
            ],
            'CommonController' : [
                {path:'',handler:'home'},
                {path:'404',handler : 'pageNotFound'},
                {path:'500',handler : 'pageError'}
            ]
		}
		
	};
})(jQuery,JR);
