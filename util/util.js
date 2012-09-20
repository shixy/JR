/**
 * Desc:常用工具类
 * User: walker
 * Date: 12-3-26
 * Time: 下午3:04
 */
var util = {
    jsonDateFormart : function(dateStr){
        //2012-03-26T11:22:17.031+08:00
        var year = dateStr.substring(0,10);
        var hms = dateStr.substring(11,19);
        return year + ' '+ hms;
    },
    formatDate : function(date,format){
            var o =
            {
                "M+" : date.getMonth()+1, //month
                "d+" : date.getDate(),    //day
                "h+" : date.getHours(),   //hour
                "m+" : date.getMinutes(), //minute
                "s+" : date.getSeconds(), //second
                "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
                "S" : date.getMilliseconds() //millisecond
            }
            if(/(y+)/.test(format))
                format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o)
                if(new RegExp("("+ k +")").test(format))
                    format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            return format;
    },

    /**
     * 将字符串转化为日期
     * @param datastr eg. 2012-12-12 12:12:12
     */
    timeExchange : function (datastr) {
        var date = new Date();
        var perfex = datastr.split(' ')[0];
        var surfex = datastr.split(' ')[1]
        if (perfex) {
            var y = perfex.split('-')[0] / 1;
            //因为月是从0开始的，所以减一
            var m = perfex.split('-')[1] / 1-1;
            var d = perfex.split('-')[2] / 1;
            date.setFullYear(y, m, d);
        }
        if (surfex) {
            var h = surfex.split(':')[0] / 1;
            var m = surfex.split(':')[1] / 1;
            var s = surfex.split(':')[2] / 1;
            date.setHours(h, m, s, 0);
        }
        return date;
    }
}
