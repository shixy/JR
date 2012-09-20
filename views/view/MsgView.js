(function( $, $R ){

	/**
	 * 短消息
	 */
	function MsgView(){
		this.msgTmplId = 'msg-table';
        this.baseTmpl = '/icq.html';
	};
	
	$.extend(MsgView.prototype,{
		afterRender : function(){
			this.initEvents();
			this.loadData();
		},
        render : function(){
            var _this = this;
            $.ajax({
                url : $R.config.basePath.templates + _this.baseTmpl,
                dataType : 'html',
                success : function(html){
                    $R.mainView.render(html,_this);
                }
            });
        },
		loadData : function(){
			var _this = this;
			$R.getService('IcqService').getLocalMsg(function(data){
				var proTmpl = function(d){
					$R.processTmpl({
                        tmplEId:_this.msgTmplId,
						data : d,
						success : function(result){
							$('#record_container').html(result);
						}
					});
				};
				var showLocal = false;
				if(data){
					if(confirm('你本地尚有未提交的信息，是否查看？')){
						showLocal = true;
					}
				}
				if(showLocal){
					proTmpl(data); 
				}else{
					//从服务端获取数据
					$R.getService('IcqService').getAllMsg(function(result){
						proTmpl(result);
					});
				}
				
			});
			
		},
		initEvents : function(){
			var _this = this;
			$('#sendMsg').click(function(){
                var msgBody = {
					msg : $('#message').val(),
					receiver : $('#receiver').val(),
					sender : 'shixy'
				};
				
				if($R.isOffline){
					var noLongerTip = localStorage['noLongerTip'];
					if(!noLongerTip){
						if(confirm('网络连接出现异常，数据会自动存储在本地，待下次成功连线后可手动同步到服务端！以后不再显示该提醒？')){
							localStorage['noLongerTip'] = '1';
						}else{
							localStorage['noLongerTip'] = '';
						}
					}
				}
				
				$R.getService('IcqService').sendMsg(msgBody,function(data){
					if(data){
						$R.processTmpl({
                            tmplEId:_this.msgTmplId,
							data : data,
							success : function(result){
								$('#record_container').append(result);
								$('#message').val('');
								$('#receiver').val('');
							}
						});
					}
				});
			});
			$('a.msg_sync').live('click',function(){
				var _this = this;
				var msgId = $(this).attr('msg_id');
				if($R.isOffline){
					alert('当前处于离线模式，不能进行同步！');
				}else{
					$R.getService('IcqService').syncMsg(msgId,function(){
						//从本地删除记录
                        $R.getService('IcqService').delMsg(msgId,function(){
							$(_this).parents('div.chat_div').remove();
						});
					});
				}
			});
			$('a.msg_del').live('click',function(){
				var msgId = $(this).attr('msg_id');
				var _this = this;
				$R.getService('IcqService').delMsg(msgId,function(){
					$(_this).parents('div.chat_div').remove();
				});
			});
		}
		
	});


	$R.addView('MsgView',new MsgView());
	
})( jQuery, JR );
