# ScenicDate
This date control used for scenic ticket buy

# Use method
<pre>
var dpc = $("#calendar").InitDailyPriceCalendar({<br/>
    startdate : '2016-08-22',//控制开始日期   <br/>
    enddate : null,//控制结束日期   <br/>
    weekend : [6,0],//定义[1,2,3,4,5,6,0]不可用  <br/>
    datetdCellClick : function(result){  <br/>
        //日期选择click事件，result返回选择日期yyyy-MM-dd  <br/>
        if(result != null && result != undefined){ <br/>
            $("#appDate").html(result); <br/>
        }<br/>
        //关闭操作<br/>
        $("#linkBack").click();<br/>
    }<br/>
});<br/>
</pre>
# Demo page
<a href="https://zhf1206.github.io/ScenicDate/index.html">demo page:https://zhf1206.github.io/ScenicDate/index.html</a>

