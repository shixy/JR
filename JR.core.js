/**
 * core
 */
(function($){
	
	function JR(){
		
		this.version = '0.0.1';
		
		this.isRunning = false;
		
        //开发阶段为true,动态获取的js文件不会被浏览器缓存，正式发布请置为false
        this.debug = true;
        //是否是离线状态
        this.isOffline = false;
		//生成一个唯一的随机ID
		this.id = ('jr-'+(new Date()).getTime()+Math.random()*1000);

		//beans存放类、cache存放实例instance
		this.controllers = {
			beans : {},
			cache : {}
		};
		
		this.models = {
			beans : {}
		};
		
		this.services = {
			beans : {},
			cache : {}
		};
		
		this.views = {
			beans : {},
			cache : {}
		};
		//Ajax请求时的遮罩,需自行重写
		this.mask = {
			show : function(){},
			hide : function(){}
		};
	};
	
	$.extend(JR.prototype,{
		
		addBean : function(target,name,value){
			
			var constructor = value.constructor;
			
			target.beans[name] = value;
			
			//检查constructor是否为一个方法，如果是方法则证明value为一个类而非一个实例
			if(constructor != Function){
				
				target.beans[name] = value.constructor;
				
				//将实例缓存起来
				target.cache[name] = value;
				
				if(this.isRunning){
					this.initBean(value);
				}
			}
		},
		
		initBean : function(instance){
			
			//判断实例是否定义init方法，如果有定义就先执行init方法
			if(instance.init){
				instance.init();
			}
		},
		
		initBeans : function( beans ){
			
			var _this = this;
			
			$.each(beans,function( index, instance ){
				_this.initBean( instance );
			});
		},
		
		addController : function(name,controller){
			this.addBean( this.controllers, name, controller );
			
		},
		
		addModel : function(name,model){
			this.addBean( this.models, name, model );
		},
		
		addService : function(name,service){
			this.addBean(this.services, name, service);
		},
		
		addView : function(name,view){
			this.addBean(this.views, name, view);
		},
		
		getView : function(beanName, initArgs){
			return ( this.getBean('views', beanName, initArgs) );
		},
		
		createModel : function(beanName, initArgs){
			return ( this.getBean('models', beanName, initArgs) );
		},
		
		getService : function(beanName, initArgs){
			return ( this.getBean('services', beanName, initArgs) );
		},
		
		/**
		 * 获取类的实例
		 */
		getBean : function(targetName, beanName, initArgs){
			var target = this[targetName];
			
			//判断类是否已经加载，如果未加载，从服务器获取并加载
			if(!target.beans[beanName]){
				this.loadBean(targetName,beanName);
			}
			//优先从cache中获取
			if(target.cache && target.cache[beanName]){
				return (target.cache[beanName]);
			}else{
				var newInstance = new (target.beans[beanName])(initArgs);
				return (newInstance);
			}
		},
		
		/**
		 * 同步加载js
		 * @param phase 所属层  views/controllers/models/services
		 * @param moduleName 类名(文件名与类名必须相同)
		 */
		loadBean : function(phase, beanName){
			var basePath = this.config.basePath[phase];
            $.ajax({
                url : basePath+'/'+beanName+'.js',
                dataType : 'script',
                cache: !this.debug,
                async : false,
                error : function(){
                    alert('连接服务器失败，或者资源不全,请检查配置文件！');
                }
            })
		},
		/**
		 * 加载controller
		 */
		loadController : function(ctrlName){
			if(!this.controllers.beans[ctrlName]){
				this.loadBean('controllers',ctrlName);
			}
		},

        initNetworkEvents:function(){
            var _this = this;
            window.addEventListener('online', function() {
                _this.isOffline = false;
                $('#onlineSet').text('当前模式：在线').slideDown();
                setTimeout(function(){
                    $('#onlineSet').slideUp();
                }, 3000);
            }, true);
            window.addEventListener('offline', function() {
                _this.isOffline = true;
                $('#onlineSet').text('当前模式：离线').slideDown();
            }, true);
        },
		
		/**
		 * 初始化各个层
		 */
		init : function(){
            this.isRunning = true;
            this.initBeans(this.controllers.cache);
            this.initBeans(this.services.cache);
            this.initBeans(this.views.cache);
            this.initNetworkEvents();
            if(this.config){
                if(this.checkLogin()){
                      this.mainView = this.getView(this.config.mainViewName);
               	      this.route.init();
                }else{
                    alert('您没有登录或者会话已失效，请重新登录！');
                }
            }
		},

		/**
		 * 检查用户是否已经登录
		 */
		checkLogin : function(){
            this.uid = $.cookies.get('UID');
	        return !!this.uid;
		},
        redirectTo : function(path){
            this.route.setLocation(path);
        },
		/**
		 * 应用模板
		 */
		processTmpl : function(option){
			var config = {
				tmplEId : null,
				remote : false,
				tmplPath : null,
				data : {},
				success : function(){}
			};
			$.extend(config,option);
			if(config.remote){
                $.ajax({
                    url : this.config.basePath.templates + config.tmplPath,
                    dataType : 'html',
                    cache : !this.debug,
                    success : function(html){
                        var content = $.tmpl(html,config.data);
                        config.success(content);
                    },
                    error : function(){
                        alert('没有找到模板');
                    }
                });
			}else{
				var content = $('#'+config.tmplEId).tmpl(config.data);
				config.success(content);
			}
			
		}

	});
	
	
	window.JR = new JR();
	
	return (window.JR);
	
})(jQuery);


/**
 * route util 监控浏览器地址栏，用于模拟ajax的前进后退
 */
(function($,$R){
	
	$R.route = {
		//轮询器
		locationMonitorInterval : null,
		//轮询间隔
		loopDelay : 150,
		//IE67 Fix 用iframe来模拟前进后退
		locationFrame : null,
		//上一个地址栏
		locationState : null,
		//检查location.hash变化的方式
		checkType : '',// iframeTimer(ie6,7) hashchange(html5) timer(other)
		
		init : function(){
			var _this = this;
			
			if($.browser.msie && ($.browser.version < 8 || document.documentMode < 8)) {//IE8以下的浏览器需要借助iframe来实现
				this.checkType = 'iframeTimer';
				this.wrapIframe();
				this.startLocationMonitor();
		        
		    } else if("onhashchange" in window) {//IE8+ FF3.6+ webkit浏览器拥有hashchange事件
		        
		    	this.checkType = 'hashchangeEvent';
		        $(window).bind('hashchange',function(){
		        	_this.onLocationChange(window.location.hash);
		        });
		        this.onLocationChange(window.location.hash);
		        
		    } else {//其他浏览器  FF3.6-
		        
		    	this.checkType = 'timer';
		    	this.startLocationMonitor();
		    }
		},
		
		wrapIframe : function(){
			this.locationFrame = $( "<iframe src=\"about:black\" style=\"display: none ;\" />" ).appendTo( document.body );
		},
		
		/**
		 * 开始监控浏览器地址栏
		 */
		startLocationMonitor : function(){
			var _this = this;
			//创建轮询
			this.locationMonitorInterval = setInterval(
				function(){
					_this.checkLocation();
				},
				_this.loopDelay);
		},
		
		/**
		 * 停止监控浏览器地址栏
		 */
		stopLocationMonitor : function(){
			clearInterval( this.locationMonitorInterval );
		},
		
		checkLocation : function(){
			var location = window.location.hash;
			var liveLocation = this.formatHash(location);
			if(this.locationState == null || this.locationState != liveLocation){
				if(this.checkType == 'iframeTimer'){
					this.locationFrame.attr( 'src', 'ie_back.htm?_=' + (new Date()).getTime() + '&hash=' + liveLocation );
				}
				
				this.onLocationChange(location);
			};
			
		},
		
		onLocationChange : function(location){
			
			var _this = this;
			
			location = this.formatHash(location);
			
			this.locationState = location;
			
			//用于控制是否继续跳转，可在回调函数中取消跳转
			var keepRouting = true;
			
			//地址是否找到标识符
			// false   ===    404
			var routeFound = false;
			
			//在ajax请求过程 停止对地址栏监听
			if(this.checkType != 'hashchangeEvent'){
				this.stopLocationMonitor();
			}
			
			var ctrlName = this.getControllerByPath(location);
			var routeMapping = [];
			if(ctrlName != null){
				$R.loadController(ctrlName);
				routeMapping = $R.config.routeMapping[ctrlName];
			}
			
			//对所有的路径进行循环匹配
			$.each(routeMapping,function(index,mapping){
				var matches = null;
				
				if(!keepRouting){return;}
				
				//提取所有匹配的地址，如果没有匹配会返回null
				if(matches = location.match(mapping.test)){
					
					matches.shift();
					
					var result = mapping.handler.apply(mapping.controller);
					
					if(typeof result == 'boolean' && !result){
						keepRouting = false;
					};
					
					routeFound = true;
					
				};
				
			});
			
			//请求完毕，重新激活对地址栏的监听
			if(this.checkType != 'hashchangeEvent'){
				this.startLocationMonitor();
			}
			
			//没有找到匹配的路径则跳转到 404页面
			if(!routeFound){
				this.setLocation('404');
			}
		},
		
		setLocation : function(location){
			//格式化地址
			location  = this.formatHash(location);
			
			//改变浏览器地址栏
			window.location.hash = ('#'+location);
			
		},
		
		/**
		 * 格式化location为普通的地址
		 * eg. '#/search' --->  'search'
		 */
		formatHash : function(location){
			return (
                location.replace( new RegExp('^[#/]+|$','g'),'')
			);
		},
		/**
		 * 根据hash值来获取对应的controller名称
		 */
		getControllerByPath : function(path){
			var routeMapping = $R.config.routeMapping;
			var controller = null;
			for(var c in routeMapping){
				var cms = routeMapping[c];
				var matched = false;
				for(var i=0;i<cms.length;i++){
					//TODO 需要处理动态参数
					var pattern = cms[i].path;
					var regex = new RegExp( ("^" + pattern + "$"), "i" );
					if(regex.test(path)){
						matched = true;
						break;
					}
				};
				if(matched){
					controller = c;
					break;
				}
			}
			return controller;
		}
	};
	
})(jQuery,JR);

/**
 * base64加密解密工具类
 */
(function($,$R){
    $R.Base64 = function(){
        _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        this.encode = function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = _utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                    _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
            }
            return output;
        }

        this.decode = function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = _keyStr.indexOf(input.charAt(i++));
                enc2 = _keyStr.indexOf(input.charAt(i++));
                enc3 = _keyStr.indexOf(input.charAt(i++));
                enc4 = _keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = _utf8_decode(output);
            return output;
        }

        _utf8_encode = function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }
            return utftext;
        }

        _utf8_decode = function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;
            while ( i < utftext.length ) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    };

})(jQuery,JR);

/**
 * AOP
 */
(function($,$R){
	$R.AOP = function(){};
	$R.AOP.prototype = {
		// 前面织入
		before : function(targetObj, method, advice){
			var tempMtd = targetObj[method];
			targetObj[method] = function(){
				advice();
				tempMtd.apply(target, arguments);
			};
		},
		// 后面织入
		after : function(targetObj, method, advice){
			var tempMtd = targetObj[method];
			targetObj[method] = function(){
				tempMtd.apply(target, arguments);
				advice();
			};
		},
        // 包围织入
        around : function(targetObj, method, advice){
            var tempMtd = targetObj[method];
            targetObj[method] = function(){
                advice();
                tempMtd.apply(target, arguments);
                advice();
            };
        }
    };

})(jQuery, JR);

/**
 * Model 父类接口
 */
(function($,$R){

    $R.Model = function(){ };
    $.extend($R.Model.prototype,{
        get : function(cfg){
            if(cfg.callback){
                if(cfg.callback.error)cfg.error = cfg.callback.error;
                if(cfg.callback.success)cfg.success = cfg.callback.success;
                delete cfg.callback;
            };
            var base64 = new $R.Base64();
            var auth = 'Basic '+base64.encode('rsclient:rsclient');
            var newOpt = $.extend({
                type : 'get',
                dataType : 'json',
				contentType : 'application/json',
                headers:{Authorization:auth},
                error : function(jqXHR, status, error ){
                    alert('数据接口或者数据服务器异常，请联系管理员！');
                }
            },cfg)
            $.ajax(newOpt);
        },
        post : function(cfg){
            cfg.type = 'post';
            this.get(cfg);
        },
        genUid : function(tag){
            return tag+(new Date()).getTime()+Math.random()*1000;
        }
    });

	
})(jQuery,JR);

/**
 * Service 父类
 */
(function($,$R){
	$R.Service = function(){
		//nothing
	};
	
	$.extend($R.Service.prototype,{
		init : function(){},
        getCallback : function(args){
            return args[args.length-1];
        }
	});
	
})(jQuery,JR);
/**
 * Controller 父类
 */
(function($,$R){
	$R.Controller = function(){

	};
	$.extend($R.Controller.prototype,{
		route: function( beanName, path, handler ){
			
			var fpath = $R.route.formatHash( path );
		
			var parameters = [];
			var pattern = fpath.replace(
				new RegExp( "(/):([^/]+)", "gi" ),
				function( $0, $1, $2 ){
					parameters.push( $2 );
					return( $1 + "([^/]+)" );
				}
			);
			
			//缓存到配置文件，主要是为了按controller分组保存
			var routeMapping = $R.config.routeMapping[beanName];
			for(var i=0;i<routeMapping.length;i++){
				var m = routeMapping[i];
				if(m.path == path ){
					m.controller = this;
					m.parameters = parameters;
					m.test = new RegExp( ("^" + pattern + "$"), "i" );
					m.handler = handler;
				}
			}
		},
		//通过配置文件来自动装载route
		autoLoadRoute : function(ctrlName){
			var _this = this;
			var mapping  = $R.config.routeMapping[ctrlName];
			for(var i=0;i<mapping.length;i++){
				var attr = mapping[i];
				_this.route(ctrlName, attr.path,_this[attr.handler]);
			}
		}
	});
	
})(jQuery,JR);

/**
 * view  父类
 */
(function($,$R){
	$R.View = function(){
		
	};
	$.extend($R.View.prototype,{
        creatChart : function(chartSwf,chartId,chartWrapperId,data){
            //先将其销毁
            if(FusionCharts(chartId))FusionCharts(chartId).dispose();
            var chart = new FusionCharts(chartSwf, chartId, "100%", "100%", "0", "1" );
            chart.setJSONData( data );
            chart.render(chartWrapperId);
        }
	});
	
})(jQuery,JR);
/**
 * 装载页面
 */
$(function(){
	window.JR.init();
});
