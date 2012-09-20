(function($,$R){
    function IndexModel(){};
    IndexModel.prototype = new $R.Model();

    $.extend(IndexModel.prototype,{
        /**
         * 云管理员概要信息
         * @param callback
         */
        getSummaryInfo : function(callback){
            var cfg = {
                url : '/acp/stats/cloud/summary',
                callback : callback
            }
            this.get(cfg);
        },
        /**
         * 数据中心管理员概要信息
         * @param dcId 数据中心id
         * @param callback
         */
        getDatacenterSummaryInfo : function(dcId,callback){
            var cfg = {
                url : '/acp/stats/dc/'+dcId+'/summary',
                callback:callback
            };
            this.get(cfg);
        },
        /**
         * 数据中心资源使用情况
         */
        getDCUsageRes : function(dcId,callback){
            var cfg = {
                url : '/acp/stats/dc/'+dcId+'/resourceusage',
                callback:callback
            };
            this.get(cfg);
        },
        /**
         * 普通用户资源使用情况
         * @param dcId 用户所属数据中心id
         * @param uid 用户id
         * @param callback
         */
        getUsageRes : function(dcId,uid,callback){
            var cfg = {
                url : '/acp/stats/dc/'+dcId+'/user/'+uid+'/userresourceusage',
                callback:callback
            };
            this.get(cfg);
        },
        /**
         * 资源池负荷Top5
         * @param dcId 用户所属数据中心id
         * @param callback
         */
        getResTop5 : function(dcId,callback){
            var cfg = {
                url : '/acp/stats/dc/'+dcId+'/resourcespoolloadtop',
                callback:callback
            };
            this.get(cfg);
        },
        /**
         * 主机负荷Top5
         * @param dcId 用户所属数据中心id
         * @param callback
         */
        getHostTop5 : function(dcId,callback){
            var cfg = {
                url : '/acp/stats/dc/'+dcId+'/hostsloadtop',
                callback:callback
            };
            this.get(cfg);
        },
        /**
         * 获取数据中心最新日志
         * @param dcId 数据中心id
         * @param filterInfo 查询条件
         * @param callback
         */
        getlatestLog : function(dcId,filterInfo,callback){
            var cfg = {
                url : '/acp/log/list/'+dcId+'/userlog',
                data : filterInfo,
                callback:callback
            };
            this.post(cfg);
        },
        /**
         * 获取所有数据中心最新日志
         * @param filterInfo 查询条件
         * @param callback
         */
        getlatestLogAll : function(filterInfo,callback){
            var cfg = {
                url : '/acp/log/list/userlog',
                data : filterInfo,
                callback:callback
            };
            this.post(cfg);
        },
        /**
         * 获取数据中心最新应用
         * @param dcId 数据中心id
         * @param top  需要查询的记录数
         * @param callback
         */
        getLatestApp : function(dcId,top,callback){
            var cfg = {
                url : '/acp/apprepo/dc/'+dcId+'/latestResource/resourcesStat/lastestUpload-'+top,
                callback:callback
            };
            this.get(cfg);
        },
        /**
         * 获取所有数据中心最新应用
         * @param top  需要查询的记录数
         * @param callback
         */
        getLatestAppAll : function(top,callback){
            var cfg = {
                url : '/acp/apprepo/latestResource/resourcesStat/lastestUpload-'+top,
                callback:callback
            };
            this.get(cfg);
        }

    });
    $R.addModel('IndexModel',IndexModel);
})(jQuery, JR);
