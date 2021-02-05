/**
 * 时间格式
 */
var STATEYEAR = 'yyyy';
var STATEMONTH = 'MM';
var STATEYEARMONTH = 'yyyy-MM';
var STATEDATE = 'yyyy-MM-dd';
var STATEYM = 'yyyy-MM';
var STATETIME = 'HH:mm:ss';
var STATETIMEHM = 'HH:mm';
var STATEDATETIME = 'yyyy-MM-dd HH:mm:ss';

function loading(tag) {
	unloading();
	$(tag).append('<div class="loading"></div>');
}
function unloading() {
	$('.loading').remove();
}

var hintTimeout;
var node1, node2, length, num = 28, timeLength = 4000;
function initMain() {
	require([ "app/util", "dijit/layout/TabContainer",
			"dojox/layout/ContentPane", "dojo/parser", "dojo/on",
			'dojo/dom-class', "dojo/dom-style", "dojo/domReady!" ], function(
			util, TabContainer, ContentPane, parser, on, domClass, domStyle) {

		var cp = new dojox.layout.ContentPane({
			title : '调度服务',
			closable : true
		});

		tc.addChild(cp);
		cp.set('href', 'app/html/zcgl/ddfw.html');
		tc.selectChild(cp);
		tc.startup();
		tc.resize();
	});

}
if (!Date.format){
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    };
}

function setformatday(obj) {
	var y = (obj.getFullYear()).toString();
	var m = (obj.getMonth() + 1).toString();
	if (m.length == 1) {
		m = "0" + m;
	}
	var d = obj.getDate().toString();
	if (d.length == 1) {
		d = "0" + d;
	}
	var h = obj.getHours().toString();
	if (h.length == 1) {
		h = "0" + h;
	}
	var mi = obj.getMinutes().toString();
	if (mi.length == 1) {
		mi = "0" + mi;
	}
	var s = obj.getSeconds().toString();
	if (s.length == 1) {
		s = "0" + s;
	}
	var time = y + "-" + m + "-" + d;
	return time;
}
function setformatyear(obj) {
	var y = (obj.getFullYear()).toString();
	var time = y;
	return time;
}
function getPrevDay1(date) {
    var y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate() - 1;
    var fm = m.toString().length === 1 ? '0' + m : m,
        fd = d.toString().length === 1 ? '0' + d : d,
        fdate = y + '-' + fm + '-' + fd;
    return new Date(fdate);
}
function getAddDay1(date) {
    var y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate() + 1;
    var fm = m.toString().length === 1 ? '0' + m : m,
        fd = d.toString().length === 1 ? '0' + d : d,
        fdate = y + '-' + fm + '-' + fd;
    return new Date(fdate);
}
function setformat2(obj) {
	var y = (obj.getFullYear()).toString();
	var m = (obj.getMonth() + 1).toString();
	if (m.length == 1) {
		m = "0" + m;
	}
	var d = obj.getDate().toString();
	if (d.length == 1) {
		d = "0" + d;
	}
	var h = obj.getHours().toString();
	if (h.length == 1) {
		h = "0" + h;
	}
	var mi = obj.getMinutes().toString();
	if (mi.length == 1) {
		mi = "0" + mi;
	}
	var s = obj.getSeconds().toString();
	if (s.length == 1) {
		s = "0" + s;
	}
	var time = y + "-" + m + "-" + d+" 00:00:00";
	return time;
}

function setformat1(obj) {
	var y = (obj.getFullYear()).toString();
	var m = (obj.getMonth() + 1).toString();
	if (m.length == 1) {
		m = "0" + m;
	}
	var d = obj.getDate().toString();
	if (d.length == 1) {
		d = "0" + d;
	}
	var h = obj.getHours().toString();
	if (h.length == 1) {
		h = "0" + h;
	}
	var mi = obj.getMinutes().toString();
	if (mi.length == 1) {
		mi = "0" + mi;
	}
	var s = obj.getSeconds().toString();
	if (s.length == 1) {
		s = "0" + s;
	}
	var time = y + "-" + m + "-" + d + " " + h + ":" + mi + ":" + s;
	return time;
}

function setformat3(obj) {
	var y = (obj.getFullYear()).toString();
	var m = (obj.getMonth() + 1).toString();
	if (m.length == 1) {
		m = "0" + m;
	}
	var d = obj.getDate().toString();
	if (d.length == 1) {
		d = "0" + d;
	}
	var h = obj.getHours().toString();
	if (h.length == 1) {
		h = "0" + h;
	}
	var mi = obj.getMinutes().toString();
	if (mi.length == 1) {
		mi = "0" + mi;
	}
	var s = obj.getSeconds().toString();
	if (s.length == 1) {
		s = "0" + s;
	}
	var time = y + "-" + m + "-" + d;
	return time;
}
function setformat4(obj) {
	var y = (obj.getFullYear()).toString();
	var m = (obj.getMonth() + 1).toString();
	if (m.length == 1) {
		m = "0" + m;
	}
	var d = obj.getDate().toString();
	if (d.length == 1) {
		d = "0" + d;
	}
	var h = obj.getHours().toString();
	if (h.length == 1) {
		h = "0" + h;
	}
	var mi = obj.getMinutes().toString();
	if (mi.length == 1) {
		mi = "0" + mi;
	}
	var s = obj.getSeconds().toString();
	if (s.length == 1) {
		s = "0" + s;
	}
	var time = y + "-" + m + "-01";
	return time;
}
function setformat5(obj) {
	var y = (obj.getFullYear()).toString();
	var m = (obj.getMonth() + 1).toString();
	if (m.length == 1) {
		m = "0" + m;
	}
	var time = y + "-" + m;
	return time;
}
function setformat_month(obj) {
	var y = (obj.getFullYear()).toString();
	var m = (obj.getMonth() + 1).toString();
	if (m.length == 1) {
		m = "0" + m;
	}
	var time = y + "-" + m;
	return time;
}
function GetDateStr(AddDayCount) { 
	var dd = new Date(); 
	dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
	
	var y = (dd.getFullYear()).toString();
	var m = (dd.getMonth() + 1).toString();
	if (m.length == 1) {
		m = "0" + m;
	}
	var d = dd.getDate().toString();
	if (d.length == 1) {
		d = "0" + d;
	}
	return y+"-"+m+"-"+d; 
} 
function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式  
    var  aDate,  oDate1,  oDate2,  iDays  
    aDate  =  sDate1.split("-")  
    oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2002格式  
    aDate  =  sDate2.split("-")  
    oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])  
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数  
    return  iDays  
}

function logout() {
	var xhrArgs = {
		url : basePath + "common/logout",
		handleAs : "json",
		preventCache : true,
		withCredentials : true,
		load : function(data) {
			console.log(data);
			if (data == '1') {
				javascript: window.location = 'login.html';
			}
		}
	};

	dojo.xhrPost(xhrArgs);
}

function getBasisTabIndex(item) {
    var tabs = tc.getChildren();
    var index = -1;
    for (var i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        if (item === tab.title) {
            index = i;
            break;
        }
    }
    return index;
}
function getTabIndex(item) {
	var tabs = tc.getChildren();
	var index = -1;
	for (var i = 0; i < tabs.length; i++) {
		var tab = tabs[i];
		if (item.id && item.pid) {
			var sign = tab.sign.split('|');
			var id = sign[1], pid = sign[0], title = tab.title;
			if (id === item.id && pid === item.pid && title === item.title) index = i;
		} else {
			if (tab.sign === item.sign && tab.title === item.title) index = i;
		}
	}
	return index;
}

function fireNavItem(title) {
	dojo.query('#mainSplitterLeft_ul .li2').forEach(function(item, index) {
		if (item.innerText == title) {
			item.click()
		}
	})
}

function getCurrentYear() {
	var date = new Date();
	return {
		"start" : date.getFullYear() + "-01-01",
		"end" : date.getFullYear() + "-12-31"
	};
}

function getCurrentMonth() {
	var date = new Date();
	return {
		"start" : date.getFullYear() + "-" + (date.getMonth() + 1) + "-01",
		"end" : date.getFullYear() + "-" + (date.getMonth() + 1) + "-"
				+ getLastDay(date.getFullYear(), (date.getMonth() + 1))
	}
};

function getLastDay(year, month) {
	var new_year = year; // 取当前的年份
	var new_month = month++; // 取下一个月的第一天，方便计算（最后一天不固定）
	if (month > 12) // 如果当前大于12月，则年份转到下一年
	{
		new_month -= 12; // 月份减
		new_year++; // 年份增
	}
	var new_date = new Date(new_year, new_month, 1); // 取当年当月中的第一天
	return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); // 获取当月最后一天日期
}

function getCurrentTime() {
	var myDate = new Date();
	var xq = "";
	if (myDate.getDay() == 0) {
		xq = "星期日";
	} else if (myDate.getDay() == 1) {
		xq = "星期一";
	} else if (myDate.getDay() == 2) {
		xq = "星期二";
	} else if (myDate.getDay() == 3) {
		xq = "星期三";
	} else if (myDate.getDay() == 4) {
		xq = "星期四";
	} else if (myDate.getDay() == 5) {
		xq = "星期五";
	} else if (myDate.getDay() == 6) {
		xq = "星期六";
	}
	return (myDate.getMonth() + 1) + "月" + myDate.getDate() + "日   " + xq;
	// return (date.getMonth() + 1) + "月"+date.getDate()+"日
	// "+date.getHours()+":"+date.getMinutes(),
	// "end": date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +
	// getLastDay(date.getFullYear(), (date.getMonth() + 1))

}
function b() {
	var t = parseInt(node1.css('top'));
	// console.info(node1.style('top'))
	node2.css('top', num);
	node1.animate({
		top : t - num + 'px'
	}, 'slow');
	if (Math.abs(t) == length - num) {
		node2.animate({
			top : '0px'
		}, 'slow');
		var _node = node1;
		node1 = node2;
		node2 = _node;
	}
	hintTimeout = setTimeout(b, timeLength);
}
// $(function() {
function gunp() {
	$('.swap').html($('.hintBox_li').html());
	node1 = $('.hintBox_li');
	node2 = $('.swap');
	length = $('.hintBox_li li').length * num;
	$('.hintBox').hover(function() {
		clearTimeout(hintTimeout);
	}, function() {
		hintTimeout = setTimeout(b, timeLength);
	});

	hintTimeout = setTimeout(b, timeLength);
}// );

// 查找门店
function findmd() {
	var xhrArgs = {
		url : basePath + "storemanage/findStore",
		postData : 'postData={"keyword":""}',
		handleAs : "json",
	};
	return dojo.xhrPost(xhrArgs);
}
// end查找门店
// 查找车型
function findcx() {
	var xhrArgs = {
		url : basePath + "cartype/findtype",
		postData : 'postData={"keyword":""}',
		handleAs : "json",
	};
	return dojo.xhrPost(xhrArgs);
}
// end查找车型
// 查找车辆
function findcl(md, cx) {
	var xhrArgs = {
		url : basePath + "vehiinfo/findcarbylx",
		postData : 'postData={"md":"' + md + '","cx":"' + cx + '"}',
		handleAs : "json",
	};
	return dojo.xhrPost(xhrArgs);
}
// end查找车辆
// 查找客户
function findkh(name) {
	var xhrArgs = {
		url : basePath + "clientmanage/findClientName",
		postData : 'postData={"name":"' + name + '"}',
		handleAs : "json",
	};
	return dojo.xhrPost(xhrArgs);
}
// end查找车辆

function filterDbt() {
	var xhrArgs = {
		url : basePath + "common/getDbtSelect",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function filterTcc() {
	var xhrArgs = {
		url : basePath + "common/getTccSelect",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function filterCl(cllx) {
	if (!cllx)
		cllx = '';
	var xhrArgs = {
		url : basePath + "common/getClSelect",
		postData : 'postData={"cllx":"' + cllx + '"}',
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function filterJsy() {
	var xhrArgs = {
		url : basePath + "common/getJsySelect",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function getClZt(cphm) {
	var xhrArgs = {
		url : basePath + "common/getCpZt",
		postData : 'postData={"cphm":"' + cphm + '"}',
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 预选车辆
function yxCl(cphm, hth_num) {
	var json = {
		"cphm" : cphm,
		"hth_num" : hth_num
	}
	var xhrArgs = {
		url : basePath + "common/yxCl",
		postData : 'postData=' + dojo.toJson(json),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 取消预选车辆
function qxyxCl(hth_num) {
	var json = {
		"hth_num" : hth_num
	}
	var xhrArgs = {
		url : basePath + "common/qxyxCl",
		postData : 'postData=' + dojo.toJson(json),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function qxyxXgCl(hth_num, cphm, oldcphm) {
	var json = {
		"hth_num" : hth_num,
		"cphm" : cphm,
		"oldcphm" : oldcphm
	}
	var xhrArgs = {
		url : basePath + "common/qxyxXgCl",
		postData : 'postData=' + dojo.toJson(json),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 预选车辆
function yxJsy(sjxm, hth_num) {
	var json = {
		"sjxm" : sjxm,
		"hth_num" : hth_num
	}
	var xhrArgs = {
		url : basePath + "common/yxJsy",
		postData : 'postData=' + dojo.toJson(json),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 取消预选车辆
function qxyxJsy(hth_num) {
	var json = {
		"hth_num" : hth_num
	}
	var xhrArgs = {
		url : basePath + "common/qxyxJsy",
		postData : 'postData=' + dojo.toJson(json),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 新司机， 老司机
function qxyxXgJsy(hth_num, sjxm, oldsjxm) {
	var json = {
		"hth_num" : hth_num,
		"sjxm" : sjxm,
		"oldsjxm" : oldsjxm
	}
	var xhrArgs = {
		url : basePath + "common/qxyxXgJsy",
		postData : 'postData=' + dojo.toJson(json),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function addZcgl(json) {
	var xhrArgs = {
		url : basePath + "common/addZcgl",
		postData : 'postData=' + json,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function addYjfw(json) {
	var xhrArgs = {
		url : basePath + "common/addYjfw",
		postData : 'postData=' + json,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function getZcgl(json) {
	var xhrArgs = {
		url : basePath + "common/getZcgl",
		postData : 'postData=' + json,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function callbackError(data) {
	console.log('ajax error', data);
}
function testYsData(type) {
	if (type == 1) {// dd
		ddfwForm.setValues({
			hth : "HTDD-1002",
			xm : "杨杨",
			sfzhm : "360234199902032010",
			ldhm : "13852492837",
			ycdz : "施家花园东门",
			ycdx : "文艺",
			ycbm : "交通局",
			ycsl : 5

		})
	} else {
		zcglForm.setValues({
			hth : "HTZC-1200"
			// ,dbt:'1'
			,
			xm : "肖宁",
			sfzhm : "43003034198905092320",
			ldhm : "13987632947",
			ycdz : "西湖文化广场",
			ycsl : 5

		})
		dijit.byId('zcgldbt').setValue(1)
	}

	return ""
}
function testClearData(type) {
	if (type == 1) {// dd
		ddfwForm.reset()
	} else {
		zcglForm.reset()
	}
	return "";
}

function rwgl(type) {
	var sub_cp = dijit.byId('regl_sub_cp')
	if (sub_cp) {
		if (type == 'jsy') {
			sub_cp.setHref('app/html/xxgl/jsygl.html')
		} else if (type == 'xc') {
			sub_cp.setHref('app/html/xxgl/xcgl.html')
		} else if (type == 'clrygl') {
			sub_cp.setHref('app/html/xxgl/clrygl.html')
		} else if (type == 'wxrygl') {
			sub_cp.setHref('app/html/xxgl/wxrygl.html')
		}

	}
}

function ddfw_type(type) {
	var sub_cp = dijit.byId('regl_sub_cp')
	if (sub_cp) {
		if (type == 'jsy') {
			sub_cp.setHref('app/html/xxgl/jsygl.html')
		} else if (type == 'xc') {
			sub_cp.setHref('app/html/xxgl/xcgl.html')
		} else if (type == 'clrygl') {
			sub_cp.setHref('app/html/xxgl/clrygl.html')
		} else if (type == 'wxrygl') {
			sub_cp.setHref('app/html/xxgl/wxrygl.html')
		}

	}
}

// 查询条件面板展现 案源
function showCqPanel(type, panel) {
	if (type == 1) {
		$(
				[ dialog_ycdxgl_tj_1, dialog_ycdxgl_tj_2, dialog_ycdxgl_tj_3,
						dialog_ycdxgl_tj_4 ]).each(function(index, item) {
			$(item).hide();
		})
		$('#' + panel).show();
	}
	if (type == 2) {
		$(
				[ dialog_clgl_tj_1, dialog_clgl_tj_2, dialog_clgl_tj_3,
						dialog_clgl_tj_4, dialog_clgl_tj_5 ]).each(
				function(index, item) {
					$(item).hide();
				})
		$('#' + panel).show();
	}
	if (type == 3) {
		$([ dialog_jsygl_tj_1, dialog_jsygl_tj_2, dialog_jsygl_tj_3 ]).each(
				function(index, item) {
					$(item).hide();
				})
		$('#' + panel).show();
	}

}
Date.prototype.Format = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};



function findxhcddcphm(){
	var data = [{'CPHM' : '浙A1T638'},{'CPHM' : '浙A0T335'},{'CPHM' : '浙A0T378'},{'CPHM' : '浙A1T618'},{'CPHM' : '浙A2T009'},{'CPHM' : '浙A2T089'},{'CPHM' : '浙A1T671'}];
	return data;
}

//返回地理编码geocoder
function getgeocoder(){
	var geocoder = new AMap.Geocoder({
		radius: 1000,
		extensions: "all"
	});   
	return geocoder;
}
//通知状态
function hbzt2(obj) {
	if (obj == "0")
		return "通知成功";
	if (obj == "3")
		return "外拨失败";
	if (obj == "5")
		return "确认收到";
	if (obj == "7")
		return "7";
	if (obj == "255")
		return "未外呼";
}
// 车辆方向
function dlwz(obj) {
	if (obj == 0) {
		return "正北";
	} else if (obj == 90) {
		return "正东";
	} else if (obj == 180) {
		return "正南";
	} else if (obj == 270) {
		return "正西";
	} else if (obj > 0 && obj < 90) {
		return "东北";
	} else if (obj > 90 && obj < 180) {
		return "东南";
	} else if (obj > 180 && obj < 270) {
		return "西南";
	} else if (obj > 270 && obj < 360) {
		return "西北";
	}
}
function kzc(obj) {
	if (obj == 0) {
		return "空车";
	} else {
		return "重车";
	}
}

/**
 * 添加ComboBox事件
 * @param panelId：表单或查询条件面板的id
 */
function addEventComboBox(panelId) {
	$(panelId + ' .iFComboBox').find('input[type=text]').off('.comboboxInput').on('focus.comboboxInput', function () {
		$(this).siblings('.iFList').show();
	}).on('blur.comboboxInput', function () {
		var thisOne = $(this);
		setTimeout(function () {
			thisOne.siblings('.iFList').hide();
		}, 200);
	}).end().find('a').off('click').on('click', function () {
		if ($(this).siblings('.iFList').css('display')==='none'){
			$(this).siblings('input[type=text]').focus();
		}
	}).end().find('.iFList li').off('click').on('click', function () {
		$(this).addClass('selected').siblings('.selected').removeClass('selected');
		var value = $(this).text();
		var key = $(this).attr('data-value');
//		console.log(value,key);
		$(this).parent().parent().find('input').attr('data-value', key);
		$(this).parent().parent().find('input').val(value);
		$(this).parent().parent().find('input').trigger('change');
		//$(this).parent().parent().find('input').attr({value: value, 'data-value': key});//.trigger('change');
	});
}
/**
 * 添加ComboBoxList事件
 * @param id：combobox的id
 */
function addEventComboBoxList(id) {
	
	$(id + '.iFComboBox').find('.iFList li').off('click').on('click', function () {
		$(this).addClass('selected').siblings('.selected').removeClass('selected');
		var value = $(this).text();
		var key = $(this).attr('data-value');
		$(this).parent().parent().find('input').attr('data-value', key);
		$(this).parent().parent().find('input').val(value);
		$(this).parent().parent().find('input').trigger('change');
	});
}
function utils(item) {
	var it = item.split('\n');
	var html = '';
	for(var i=0;i<it.length;i++){
		var item = it[i];
		html+= '<p>'+item+'</p>';
	}
	return html;
}
//短信发送信息
function getdxxx(obj) { // 1乘客，2 司机
	var xhrArgs = {
		url : basePath + "ddxpt/getdxxx",
		postData : "dxlx=" + obj,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function sendcldx(obj) { // 司机
	isus = obj.isu;
	var xhrArgs = {
		url : basePath + "xhcdd/sendcldx",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
//右键短信通知
function senddx(obj) {
	var xhrArgs = {
			url : basePath + "xhcdd/senddx",
			postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
			handleAs : "json"
		};
		return dojo.xhrPost(xhrArgs);
}
//右键电话通知
function dhtz(obj) {
	var xhrArgs = {
		url : basePath + "xhcdd/dhtz",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
//小货车调度定位
function xhcdddw(){
	var xhrArgs = {
			url : basePath + "xhcdd/xhcdddw",
			handleAs : "json"
		};
		return dojo.xhrPost(xhrArgs);
}
//调度构建自定义信息窗体
function createInfoWindow(title, content) {
	var info = document.createElement("div");
	info.className = "info";

	// 可以通过下面的方式修改自定义窗体的宽高
	// info.style.width = "400px";
	// 定义顶部标题
	var top = document.createElement("div");
	var titleD = document.createElement("div");
	var closeX = document.createElement("img");
	top.className = "info-top";
	titleD.innerHTML = title;
	closeX.src = "resources/images/carpic/close2.gif";
	closeX.onclick = closeInfoWindow;

	top.appendChild(titleD);
	top.appendChild(closeX);
	info.appendChild(top);

	// 定义中部内容
	var middle = document.createElement("div");
	middle.className = "info-middle";
	middle.style.backgroundColor = 'white';
	middle.innerHTML = content;
	info.appendChild(middle);

	// 定义底部内容
	var bottom = document.createElement("div");
	bottom.className = "info-bottom";
	bottom.style.position = 'relative';
	bottom.style.top = '0px';
	bottom.style.margin = '0 auto';
	var sharp = document.createElement("img");
	sharp.src = "resources/images/carpic/sharp.png";
	bottom.appendChild(sharp);
	info.appendChild(bottom);
	return info;
}

function gettb(obj, b) {
	// 空车，重车，离线，任务车
	if (b == 1) {
		if (obj.HEADING == 0||obj.HEADING == ""||obj.HEADING == null||obj.HEADING == undefined) {
			return "resources/images/car/z1.png";
		} else if (obj.HEADING == 90) {
			return "resources/images/car/z2.png";
		} else if (obj.HEADING == 180) {
			return "resources/images/car/z3.png";
		} else if (obj.HEADING == 270) {
			return "resources/images/car/z4.png";
		} else if (obj.HEADING > 0 && obj.HEADING < 90) {
			return "resources/images/car/z5.png";
		} else if (obj.HEADING > 90 && obj.HEADING < 180) {
			return "resources/images/car/z6.png";
		} else if (obj.HEADING > 180 && obj.HEADING < 270) {
			return "resources/images/car/z7.png";
		} else if (obj.HEADING > 270 && obj.HEADING < 360) {
			return "resources/images/car/z8.png";
		}
	} else if (b == 3){
		if (obj.HEADING == 0||obj.HEADING == ""||obj.HEADING == null||obj.HEADING == undefined) {
			return "resources/images/carpic/k1.png";
		} else if (obj.HEADING == 90) {
			return "resources/images/carpic/k2.png";
		} else if (obj.HEADING == 180) {
			return "resources/images/carpic/k3.png";
		} else if (obj.HEADING == 270) {
			return "resources/images/carpic/k4.png";
		} else if (obj.HEADING > 0 && obj.HEADING < 90) {
			return "resources/images/carpic/k5.png";
		} else if (obj.HEADING > 90 && obj.HEADING < 180) {
			return "resources/images/carpic/k6.png";
		} else if (obj.HEADING > 180 && obj.HEADING < 270) {
			return "resources/images/carpic/k7.png";
		} else if (obj.HEADING > 270 && obj.HEADING < 360) {
			return "resources/images/carpic/k8.png";
		}
	} else if (b == 2){
		if (obj.onoffstate == "1") {
			if (obj.STATE == 0) {// 空车
				if (obj.HEADING == 0||obj.HEADING == ""||obj.HEADING == null||obj.HEADING == undefined) {
					return "resources/images/car/k1.png";
				} else if (obj.HEADING == 90) {
					return "resources/images/car/k2.png";
				} else if (obj.HEADING == 180) {
					return "resources/images/car/k3.png";
				} else if (obj.HEADING == 270) {
					return "resources/images/car/k4.png";
				} else if (obj.HEADING > 0 && obj.HEADING < 90) {
					return "resources/images/car/k5.png";
				} else if (obj.HEADING > 90 && obj.HEADING < 180) {
					return "resources/images/car/k6.png";
				} else if (obj.HEADING > 180 && obj.HEADING < 270) {
					return "resources/images/car/k7.png";
				} else if (obj.HEADING > 270 && obj.HEADING < 360) {
					return "resources/images/car/k8.png";
				}
			} else {// 重车
				if (obj.HEADING == 0||obj.HEADING == ""||obj.HEADING == null||obj.HEADING == undefined) {
					return "resources/images/car/z1.png";
				} else if (obj.HEADING == 90) {
					return "resources/images/car/z2.png";
				} else if (obj.HEADING == 180) {
					return "resources/images/car/z3.png";
				} else if (obj.HEADING == 270) {
					return "resources/images/car/z4.png";
				} else if (obj.HEADING > 0 && obj.HEADING < 90) {
					return "resources/images/car/z5.png";
				} else if (obj.HEADING > 90 && obj.HEADING < 180) {
					return "resources/images/car/z6.png";
				} else if (obj.HEADING > 180 && obj.HEADING < 270) {
					return "resources/images/car/z7.png";
				} else if (obj.HEADING > 270 && obj.HEADING < 360) {
					return "resources/images/car/z8.png";
				}
			}
		} else { // 离线
			if (obj.HEADING == 0||obj.HEADING == ""||obj.HEADING == null||obj.HEADING == undefined) {
				return "resources/images/car/l1.png";
			} else if (obj.HEADING == 90) {
				return "resources/images/car/l2.png";
			} else if (obj.HEADING == 180) {
				return "resources/images/car/l3.png";
			} else if (obj.HEADING == 270) {
				return "resources/images/car/l4.png";
			} else if (obj.HEADING > 0 && obj.HEADING < 90) {
				return "resources/images/car/l5.png";
			} else if (obj.HEADING > 90 && obj.HEADING < 180) {
				return "resources/images/car/l6.png";
			} else if (obj.HEADING > 180 && obj.HEADING < 270) {
				return "resources/images/car/l7.png";
			} else if (obj.HEADING > 270 && obj.HEADING < 360) {
				return "resources/images/car/l8.png";
			}
		}
	}
}
//新调度关闭信息窗体
function closeInfoWindow() {
	xhcddjsobj.closeInfoWindow();
}
//分机号码
var deviceId = "";
//工号(帐号)
var agentId = "";
//坐席密码
var pwd = "s123456";
//ic 服务器url地址
var url = "http://192.168.0.55:9700/icsdk";
//是否播报工号
var ConferenceStatus = "0";
//电话接通类型（外拨：2，来电：1）
var PhoneType = "1";
var username="";
var userrole="";
var userfjh="";
var clientID="";
var host = "192.168.0.102";
var port = 61624;
var destination1 = "hz_jiaochefanhui_11";
var destination2 = "hz_chakuzt_14";// 下单队列
var destination3 = "hz_quxiaoyuechefanhui_12"; // 取消约车
var destination4 = "hz_taxi_905_gd";// 报警队列
var dxclcs = 0;
checklogin();
function checklogin(){
	$.ajax({
	     url : basePath + "login/checklogin",
	     type : 'post',
	     data:{ },
	     async: false,
	     dataType: 'json',
	     success:function(data){
//	    	 console.info(data);
		    	 username = data.username;
		    	 callgh = data.username;
		    	 clientID = "xhcdd"+data.username;
		    	 userfjh = data.userfjh;
		    	 userrole = data.userrole;
		    	 connectMQ(clientID);
		    	 deviceId = data.userfjh;
		    	 agentId = "hz"+data.username;
		    	 if (!!window.ActiveXObject || "ActiveXObject" in window){
		    		$("#ddxpt-hjzx").html("连接中");
		 			$("#ddxpt-hjzx").css('color', '#37f38e');
		    		InitializationBind();
		    	 }
	     },
	     error:function(data){
	     }
	 });
}
//mq客户端监听～～～～～～～～～～～
function connectMQ(clientID){
	var meclientID = clientID+"-"+Math.floor(Math.random() * 100000)
	client = new Messaging.Client(host,Number(port),meclientID);
	client.onMessageArrived = function(e){
//		console.log("接收到的消息"+e.payloadString);

		var xxjson = JSON.parse(e.payloadString);

		if (xxjson.cmd == "13") {// 接收到的是调度状态变更
			if (xxjson.qxzt == "1") {
				$(".qdxx").prepend( 
						"<p class=''>" + xxjson.cphm + "-派车确认-" + xxjson.disp_id
								+ "," + xxjson.sj + "</p>");
				xhcddjsobj.findywd();
			} else if (xxjson.qxzt == "0") {
				if (xxjson.qq_id.indexOf(username) > -1) {
					xhcddjsobj.findywd();
				}
			} else if (xxjson.qxzt == "2"||xxjson.qxzt == "3") {
				xhcddjsobj.findywd();
			}
		} else if (xxjson.cmd.indexOf('0x8300') > -1) {
			if (isus.indexOf(xxjson.isu) > -1) {
				if(xxjson.result==0){
					layer.msg('消息下发成功！');
				}else{
					layer.msg('消息下发失败！');
				}
			} 
			isus="";
		} else if (xxjson.cmd == '14' && xxjson.qq_id.indexOf(username) > -1) {
			layer.msg('下单成功！');
			xhcddjsobj.findywd();
			xhcddjsobj.clearDD();
		} else if (xxjson.cmd == '12') {
			if (xxjson.qq_id.indexOf(username) > -1) {
				if (xxjson.qxzt == '0') {
					layer.msg('取消成功！');
				} else {
					layer.msg('取消失败！');
				}
			}
			xhcddjsobj.findywd();
		}
	};
	client.onConnectionLost = function(e) {
		console.log("消息队列连接已断开");
		$("#ddxpt-txzt").html("断开连接");
		$("#ddxpt-txzt").css('color', 'red');
		if(tcindex==2){
			dxclcs++;
			connectMQ(clientID);
		}
	};
	client.connect({
		onSuccess : function() {
			client.subscribe(destination1);
			client.subscribe(destination2);
			client.subscribe(destination3);
			client.subscribe(destination4);
			layer.msg("连接服务器成功！");
			$("#ddxpt-txzt").html("已连接");
			tcindex=2;
			$("#ddxpt-txzt").css('color', '#37f38e');
			console.log("消息队列连接成功");
		},
		onFailure : function() {
//			layer.msg("该工号已连接消息队列！");
			console.log("消息队列连接失败");
			$("#ddxpt-txzt").html("连接失败");
			$("#ddxpt-txzt").css('color', 'red');
			dxclcs++;
			if (dxclcs > 5) {
				layer.msg("连接服务器失败，请检查网络！");
			} else{
				connectMQ(clientID);
			}
		},
		cleanSession:false
		
	});
}
function queryLdjl(obj) {
	var xhrArgs = {
		url : basePath + "xhcdd/queryldjl",
		postData : "postData={'ldhm':'" + obj + "'}",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function edityh(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/edityh",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function addxyh(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/addxyh",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

//----------------start 发送黑名单----------------

function createHMD(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/createHMD",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 发送黑名单----------------
function queryOrder(obj1, obj2) {
	var xhrArgs = {
		url : basePath + "xhcdd/queryorder",
		postData : "postData={'gh':'" + username + "','qx':'" + userrole
				+ "','cp':'" + obj1 + "','bh':'" + obj2 + "'}",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
//生成请求单号
function createqqid() {
	var obj = new Date();
	var y = (obj.getFullYear()).toString();
	var m = (obj.getMonth() + 1).toString();
	if (m.length == 1) {
		m = "0" + m;
	}
	var d = obj.getDate().toString();
	if (d.length == 1) {
		d = "0" + d;
	}
	var h = obj.getHours().toString();
	if (h.length == 1) {
		h = "0" + h;
	}
	var mi = obj.getMinutes().toString();
	if (mi.length == 1) {
		mi = "0" + mi;
	}
	var s = obj.getSeconds().toString();
	if (s.length == 1) {
		s = "0" + s;
	}
	var hm = obj.getMilliseconds().toString(); // 获取当前毫秒数(0-999)
	if (hm.length == 1) {
		hm = "0" + hm;
	}
	if (hm.length == 2) {
		hm = "0" + hm;
	}
	var time = username + "-" + y + "" + m + "" + d + "" + h + "" + mi + "" + s
			+ "" + hm;
	return time;
}

//----------------start 发送调度请求----------------

function xdd(obj) {
	var xhrArgs = {
		url : basePath + "xhcdd/xdd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 发送调度请求----------------
//----------------start 重新调度请求----------------

function xddcxdd(obj) {
	var xhrArgs = {
		url : basePath + "xhcdd/cxdd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 重新调度请求----------------
//----------------start 发送取消调度请求----------------

function qxdd(obj) {
	var xhrArgs = {
		url : basePath + "xhcdd/qxdd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 发送取消调度请求----------------
//右键调度完成
function ddwc(obj) {
	var xhrArgs = {
		url : basePath + "xhcdd/ddwc",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
//右键解除锁车
function jcsc(obj) {
	var xhrArgs = {
		url : basePath + "xhcdd/jcsc",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
//右键手动催单
function sdcd(obj) {
	var xhrArgs = {
		url : basePath + "xhcdd/sdcd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
//第一次加载就登陆
//window.InitializationBind();
function InitializationBind() {
	setTimeout("SendLogin()", 3000);
}
//登录
var status = null;
function SendLogin() {
	// 返回0初始化成功，其他表示失败
	// alert(url);
	var a = CTIProxy.Init(url, url);
	console.log("初始化--" + a);
	$("#ddxpt-hjzx").html("已连接");
	$("#ddxpt-hjzx").css('color', '#37f38e');
	setTimeout("timelogin()", 1000);
}
function timelogin() {
	// 登陆请求(帐号,密码,分机号码)返回1成功,其他失败
	console.log(agentId + "  " + pwd + "  " + deviceId);
	var a = CTIProxy.Login(agentId, pwd, deviceId);
	console.log("登陆--" + a);
}
//退出
function SendLogout() {
	var a = CTIProxy.Logout();
	if (a == 1) {
		layer.msg("坐席退出");
	} else {
		layer.msg("坐席退出失败");
	}
}
//离席
function ZhimangAUX() {
	var a = CTIProxy.MakeAUX("0");
	console.log("置忙--" + a);
}
//就绪
function SendAvailable() {
	var a = CTIProxy.MakeAvailable();
	console.log("就绪--" + a);
}
//电话外拨
function SendMakeCall(dh) {
	PhoneType = "2";
	if(dh.length<7){
		CTIProxy.MakeCall(dh);
	}else{                                                                                                                                                                                                                                                                                                                         
		CTIProxy.MakeCall("9" + dh);
	}
}
//保持电话
function ContinueCall() {
	CTIProxy.Hold();
}
//恢复
function CompleteCall() {
	CTIProxy.Retrieve();
}
//电话会议
function SendBeginConference(dh) {
	PhoneType = "2";
	voicestate = 3;
	CTIProxy.BeginConference(dh, "1");
}
//发送会议完成
function SendCompleteConference() {
	CTIProxy.CompleteConference();
}
//发送会议取消
function SendCancelConference() {
	CTIProxy.CancelConference();
}


var callstate="";
var voicestate=-1;
//来电
function CallIncommingEvt(ANI){
	voicestate = 2;
	console.log("坐席来电1--电话="+ANI);
	$("#dhdqzt").html("来电中");
	$("#xhcddldhm").val(ANI);
	$("#xhcddhbdh").val(ANI);
	$("#xhcddfjxx").val(ANI);
	$("#xhcddldhm-combobox").find('.iFList').append("<li data-value='"+ANI+"'>"+ANI+"</li>");
//	if($("#xddldhm-combobox").find('.iFList').find('li').length>5){
//		$($("#xddldhm-combobox").find('.iFList').find('li')[5]).remove();
//	}
	addEventComboBoxList('#xhcddldhm-combobox');
	xhcddjsobj.ldjl(ANI);
}
//电话接听事件
function CallConnectEvt(ANI){
	console.log("电话接通--来电="+ANI);
	$("#dhdqzt").html("正在通话");
	if(voicestate==2){
		var UUI ="{'FUNC':'playagent','AGENTID':'"+callgh+"'}";
		console.log(UUI);
		CTIProxy.BeginConference("4800", UUI);
	}
}
//挂机事件
function WrapupEvt(PhoneNum){
	console.log("电话挂机--电话号码="+PhoneNum);
	$("#dhdqzt").html(callstate);
	voicestate=1;	
	setTimeout(function(){
		CTIProxy.Complete();
	},500);
}
//对方振铃事件
function CallAlertingEvt(){
	voicestate=4;	
}
//会议开始
function StartConferenceEvt(PhoneNum){
//	if(voicestate==2){
		CTIProxy.Hold();
//	}
}
//会议完成
function CompleteConferenceEvt(PhoneNum){
//	if(voicestate==2){
		CTIProxy.Retrieve();
//	}
}
//会议中
function ConferencingEvt(PhoneNum){
	if(voicestate==2){
		CTIProxy.CompleteConference();
	}
}
//坐席登录事件
function LogInEvt(dlgh){
	console.log("坐席登陆成功--工号="+dlgh);
	callstate = "置忙";
	$("#dhdqzt").html(callstate);
	$("#ddxpt-hjzx").html("已登录");
	$("#ddxpt-hjzx").css('color', '#37f38e');
}
//坐席置忙事件
function AgentAUXEvt(dlgh){
	console.log("坐席置忙成功--工号="+dlgh);
	callstate = "置忙";
	$("#dhdqzt").html(callstate);
}
//坐席工作事件
function AgentWorkEvt(dlgh){
	console.log("坐席置闲成功--工号="+dlgh);
	callstate = "置闲";
	$("#dhdqzt").html(callstate);
}
