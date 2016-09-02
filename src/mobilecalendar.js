(function($) {
    var publicSettings, res;
    var is_leap = function(year) {
        return year % 100 == 0 ? res = year % 400 == 0 ? 1 :0 :res = year % 4 == 0 ? 1 :0;
    };
    Date.prototype.format = function(format) {
        var o = {
            "M+":this.getMonth() + 1,
            "d+":this.getDate(),
            "h+":this.getHours(),
            "m+":this.getMinutes(),
            "s+":this.getSeconds(),
            "q+":Math.floor((this.getMonth() + 3) / 3),
            S:this.getMilliseconds()
        };
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :("00" + o[k]).substr(("" + o[k]).length));
        return format;
    };
    var DailyPriceCalendar = function(options) {
        this.settings = {
            source:null,
            startdate:null,
            enddate:null,
            weekend:null,
            datetdCellClick:null
        };
        this.cheader = "<table class='pCalendar'><tr class='cheader'><td class='theader'>周日</td><td class='theader'>周一</td><td class='theader'>周二</td><td class='theader'>周三</td><td class='theader'>周四</td><td class='theader'>周五</td><td class='theader'>周六</td></tr>";
        this.settings = $.extend(this.settings, options);
        publicSettings = this.settings;
        this.Init();
    };
    DailyPriceCalendar.prototype = {
        Init:function() {
            this.ctoday = new Date();
            this.cyear = this.ctoday.getFullYear();
            this.daysNumPerMonth = new Array(31, 28 + is_leap(this.cyear), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
            this.cmonth = this.ctoday.getMonth();
            this.tempMonth = this.cmonth;
            $(this.settings.source).html("");
            this.drawCalendar(this.tempMonth);
            this.drawCalendar(++this.tempMonth);
            this.drawCalendar(++this.tempMonth);
            this.drawCalendar(++this.tempMonth);
            this.bindEvent();
        },
        BindPrice:function() {},
        addMonth:function() {
            this.drawCalendar(++this.tempMonth);
            this.bindEvent();
        },
        PrevMonth:function() {
            this.cmonth--;
            if (this.cmonth == 0) {
                this.cmonth = 12;
                this.cyear--;
            }
        },
        drawCalendar:function(m) {
            var y = this.cyear;
            if (m > 11) {
                y += Math.floor(m / 12);
                m = m % 12;
            }
            var sdate = null;
            var edate = null;
            if (this.settings.startdate != null) sdate = new Date(this.settings.startdate.replace(/-/g, "/"));
            if (this.settings.enddate != null) edate = new Date(this.settings.enddate.replace(/-/g, "/"));
            if (edate != null && new Date(y + "/" + (m + 1) + "/01") > edate) return;
            var dnow = this.ctoday.getDate();
            var n1str = new Date(y, m, 1);
            var firstday = n1str.getDay();
            var cMonthDays = this.daysNumPerMonth[m];
            var tr_str = Math.ceil((cMonthDays + firstday) / 7);
            var strcontent = "";
            var idx;
            var date_str;
            for (var i = 0; i < tr_str; i++) {
                strcontent += "<tr>";
                for (var k = 0; k < 7; k++) {
                    idx = i * 7 + k;
                    date_str = idx - firstday + 1;
                    date_str <= 0 || date_str > cMonthDays ? date_str = "" :date_str = idx - firstday + 1;
                    var dtvalue = "";
                    var dclass = "";
                    if (date_str != "") {
                        dtvalue = y + "-" + (m + 1) + "-" + date_str;
                        dclass = "datetdCell ";
                        var tempdate = new Date(dtvalue.replace(/-/g, "/"));
                        if (sdate != null && tempdate < sdate || edate != null && tempdate > edate || this.settings.weekend != null && this.settings.weekend.indexOf(k) >= 0) dclass += "disabledtd ";
                    } else {
                        dclass = "emptyCell ";
                    }
                    dtvalue = dtvalue!=""?new Date(dtvalue.replace(/-/g, "/")).format("yyyy-MM-dd"):"";
                    if (date_str == dnow && m == this.cmonth && y == this.cyear) strcontent += "<td align='center' data-value='" + dtvalue + "' class='ctoday " + dclass + "'><div>" + date_str + "</div></td>"; else {
                        strcontent += "<td align='center' data-value='" + dtvalue + "' class='" + dclass + "'><div>" + date_str + "</div></td>";
                    }
                }
                strcontent += "</tr>";
            }
            strcontent += "</table>";
            var monthTitle = "<div class='Time-Div'>" + y + "年" + (m + 1) + "月</div>";
            $(this.settings.source).append(monthTitle + this.cheader + strcontent);
        },
        bindEvent:function() {
            $(this.settings.source).find("td").unbind("click").click(function() {
                var $this = $(this);
                var curclass = $this.attr("class");
                if (curclass.indexOf("theader") >= 0 || $this.attr("data-value") == "" || curclass.indexOf("disabledtd") >= 0) return;
                $(".selected").removeClass("selected");
                $this.addClass("selected");
                var result = $this.attr("data-value");
                if (publicSettings.datetdCellClick != null) publicSettings.datetdCellClick(result);
            });
            $("#pmonth").click(function() {
                this.PrevMonth();
            });
            $("#nmonth").click(function() {
                this.NextMonth();
            });
        },
        getSelectValue:function() {
            return $(this.settings.source).find(".selected").attr("data-value");
        },
        setStartDate:function(sdate) {
            this.settings.startdate = sdate;
            this.Init();
        },
        setEndDate:function(edate) {
            this.settings.enddate = edate;
            this.Init();
        },
        setDaysOfWeekDisabled:function(weekend) {
            this.settings.weekend = weekend;
            this.Init();
        }
    };
    $.fn.extend({
        InitDailyPriceCalendar:function(options) {
            if (!options) options = {};
            options.source = $(this);
            var dpc = new DailyPriceCalendar(options);
            return dpc;
        }
    });
})(jQuery);