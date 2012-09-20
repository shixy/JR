/**
 * Desc： 短消息
 * User: walker
 * Date: 12-8-22
 * Time: 上午9:50
 */
(function($,$R){
    function MsgController(){
        this.autoLoadRoute('MsgController');
    }
    MsgController.prototype = new $R.Controller();
    $.extend(MsgController.prototype,{
            //短消息首页
            main : function(){
                this.msgView = $R.getView('MsgView');
                this.msgView.render();
            }
        });
    $R.addController("MsgController",new MsgController());
})(jQuery,JR)
