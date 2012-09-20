(function( $, $R ){
	/**
	 * 首页
	 */
	function IndexView(){
        this.moduleName = '首页';
        this.userType = $.cookies.get('UTYPE');
        this.dcId = $.cookies.get('DCID');
        this.userId = $.cookies.get('UID');
        var  tmpls = {
            'USER' : '/userIndex.tmpl',
            'DATACENTER_ADMIN' : '/dcIndex.tmpl',
            'ADMIN': '/adminIndex.tmpl'
        }
        this.indexTmpl =tmpls[this.userType];
    };
    IndexView.prototype = new $R.View();
	$.extend(IndexView.prototype,{
        init : function(){
            this.indexService = $R.getService('IndexService');
        },
        render : function(){
            var _this = this;
            $R.processTmpl({
                remote : true,
                tmplPath :_this.indexTmpl,
                success : function(result){
                    $R.mainView.render(result,_this);
                }
            });
            $R.mainView.setNavName(this.moduleName);
        },
        afterRender : function(){
            if(this.userType == 'USER'){
                this.showResUsage(this.dcId,this.userId);
                this.showlatestApp(this.dcId);
                this.showlatestLog(this.dcId);
            }else if(this.userType == 'DATACENTER_ADMIN'){
                this.showResUsage(this.dcId);
                this.showSummInfo(this.dcId);
                this.showHostTop5(this.dcId);
                this.showResTop5(this.dcId);
                this.showlatestApp(this.dcId);
                this.showlatestLog(this.dcId);
            }else if(this.userType == 'ADMIN'){

            }
            this.bindEvents();
        },
        bindEvents : function(){
            _this = this;
            $('#refreshUserChart').click(function(){
		if(_this.userType == 'USER'){
		        _this.showResUsage(_this.dcId,_this.userId);
	        }else if(_this.userType == 'DATACENTER_ADMIN'){
		        _this.showResUsage(_this.dcId);
	        }
            });
            $('#hostWrapper li').live('click',function(){
                $(this).addClass('current').siblings().removeClass('current');
                var hostId = $(this).attr('host_id');
                var resId = $(this).attr('res_id');
                $('#hostTop5Container').mask("努力加载中...");
                _this.indexService.getHostResRecord(_this.dcId,hostId,resId,{
                    success: function(cpuOtion,mmOption){
                        _this.creatChart('/src-js/lib/fusionchart/Line.swf','cpu_line_chart','cpuChartContainer',cpuOtion);
                        _this.creatChart('/src-js/lib/fusionchart/Line.swf','memory_line_chart','memoryChartContainer',mmOption);
			$('#hostTop5Container').unmask();
                    }
                });
            });
        },
        /**
         * 资源使用情况
         */
        showResUsage : function(datacenterId,userId){
            var _this = this;
            var callback={
                success:function(data){
                    _this.renderResChart(data);
                }
            };
            if(userId){
                this.indexService.getUsageRes(datacenterId,userId,callback);
            }else{
                this.indexService.getDCUsageRes(datacenterId,callback);
            }
        },
        renderResChart:function(data){
            var dialSwf = '/src-js/lib/fusionchart/AngularGauge.swf';
            this.creatChart(dialSwf,'cpu_chart','cpuUsageChart',data[0]);
            this.creatChart(dialSwf,'mm_chart','memoryUsageChart',data[1]);
            this.creatChart(dialSwf,'lcst_chart','localStorChart',data[2]);
            this.creatChart(dialSwf,'shst_chart','shareStorChart',data[3]);
            this.creatChart(dialSwf,'ip_chart','ipUsageChart',data[4]);
        },
        /**
         * 概要
         */
        showSummInfo : function(datacenterId){
            this.indexService.getSummaryInfo(datacenterId,{
                success:function(data){
                    var summary = data.summaryInfo;
                    $('#hostNum').text(summary.totalHostCount).parent().attr('title','主机:'+summary.totalHostCount+'台');
                    $('#vmNum').text(summary.totalVmCount).parent().attr('title','虚拟机:'+summary.totalVmCount+'台');
                    $('#storageNum').text(summary.totalSRCount).parent().attr('title','存储:'+summary.totalSRCount+'台');
                    $('#userNum').text(summary.totalNormalUserCount).parent().attr('title','用户:'+summary.totalNormalUserCount+'位');
                },
                error:function(e){
                    alert(e);
                }
            });
        },
        /**
         * 资源池负荷top5
         */
        showResTop5 : function(datacenterId){
            var _this = this;
	    $('#resTop5Container').mask("努力加载中...");
            this.indexService.getResTop5(datacenterId,{
                success: function(data){
                    _this.creatChart('/src-js/lib/fusionchart/Column3D.swf','res_top_chart','resTop5Chart',data);
		    $('#resTop5Container').unmask();
                }
            })
        },
        /**
         * 主机负荷top5
         */
        showHostTop5 : function(datacenterId){
	    $('#hostTop5Container').mask("努力加载中...");
            this.indexService.getHostTop5(datacenterId,{
                success:function(data){
                    var hostInfos = data.hostLoadInfo;
                    var liStr  = '';
                    $.each(hostInfos,function(i,n){
                        liStr += '<li host_id="'+n.id+'" res_id="'+n.resourcePoolProfileId+'">'+n.name+'<br>'+n.ip+'</li>'
                    });
                    $('#hostWrapper ul').html(liStr);
		    $('#hostTop5Container').unmask();
                    $('#hostWrapper ul li:first').trigger('click');
                }
            });
        },
        /**
         * 主机cpu内存负荷趋势
         */
        showHostLoad : function(){

        },
        /**
         * 最新日志
         */
        showlatestLog : function(datacenterId){
            this.indexService.getLatestLog(datacenterId,{
                success : function(data){
                    alert(data);
                }
            })
        },
        /**
         * 最新应用
         */
        showlatestApp : function(datacenterId){
            this.indexService.getLatestApp(datacenterId,{
                success:function(data){
                    $R.processTmpl({
                        tmplEId :'indexAppTmpl',
                        data : data,
                        success : function(html){
                            $('#latestAppContainer div.box_content').html(html);
                        }
                    });
                }
            })
        }
	});
    $R.addView('IndexView',new IndexView());
})( jQuery, JR );
