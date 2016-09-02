# ScenicDate
This date control used for scenic ticket buy

# Use method
var dpc = $("#calendar").InitDailyPriceCalendar({
    startdate : '2016-08-22',//控制开始日期
    enddate : null,//控制结束日期
    weekend : [6,0],//定义[1,2,3,4,5,6,0]不可用
    datetdCellClick : function(result){
        //日期选择click事件，result返回选择日期yyyy-MM-dd
        if(result != null && result != undefined){
            $("#appDate").html(result);
        }
        //关闭操作
        $("#linkBack").click();
    }
});

# Demo page
