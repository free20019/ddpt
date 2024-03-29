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

//获取月份天数
function mGetDate(year, month){
    var d = new Date(year, month, 0);
    return d.getDate();
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

// 生成地图
function createMap(mapdiv) {
	var map = new AMap.Map(mapdiv, {
		resizeEnable : true,
		zoom : 11,
		center : [ 120.16378, 30.25840 ]
	});
	map.plugin([ "AMap.ToolBar", "AMap.OverView", "AMap.Scale" ], function() {
		// 加载工具条
		tool = new AMap.ToolBar({
			direction : false,// 隐藏方向导航
			ruler : false,// 隐藏视野级别控制尺
			autoPosition : false
		// 禁止自动定位
		});
		//map.addControl(tool);
		// 加载鹰眼
		view = new AMap.OverView();

		map.addControl(view);
		// 加载比例尺
		scale = new AMap.Scale();
		map.addControl(scale);

	});
	return map;
}

function pp(obj){
	if(obj==null){
		return "";
	}
	var num = parseInt(obj.length/10);
	if(num<1){
		return obj;
	}else{
		var rs="";
		for(var i=0;i<num;i++){
			rs+=obj.substr(i*10,10)+"<br/>";
		}
		rs+=obj.substr(num*10,obj.length);
		return rs;
	}
}
//知识库查询
function findywqk(){
	var xhrArgs = {
			url : "kb/ywqk",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findcx2(){
	var xhrArgs = {
			url : "kb/cllx",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findgs(){
	var xhrArgs = {
			url : "kb/company",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findgs3(){
	var xhrArgs = {
			url : "kb/company3",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findFd(obj){
	var xhrArgs = {
			url : "kb/findfd",
			postData : {
				"keyword" : obj
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findzdlx2(){
	var xhrArgs = {
			url : "kb/zdlx",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findgs2(obj){
	var xhrArgs = {
			url : "kb/company2",
			postData : {
				"keyword" : obj
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findsimka(obj){
	var xhrArgs = {
			url : "kb/simka",
			postData : 'postData={"keyword":'+obj+'}',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findcphm(obj){
	var xhrArgs = {
			url : "kb/vehino",
			postData : 'postData={"keyword":"'+obj+'"}',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findcphm2(obj){
		if(!obj){
			obj = "111111";
		}
		var xhrArgs = {
				url : "kb/vehino2",
				postData : {
					"keyword" : obj
				},
				handleAs : "json"
		};
		return dojo.xhrPost(xhrArgs);
}
function findxnkh(obj){
	var xhrArgs = {
			url : "kb/vsimka",
			postData : 'postData={"keyword":'+obj+'}',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function findonedh(obj){
	var xhrArgs = {
			url : "kb/findonedh",
			postData : 'postData={"id":"'+obj+'"}',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function findonejl(obj){
	var xhrArgs = {
			url : "kb/findonejl",
			postData : 'postData={"id":"'+obj+'"}',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function findonedz(obj){
	var xhrArgs = {
			url : "kb/findonedz",
			postData : 'postData={"id":"'+obj+'"}',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/*弹框信息*/
var oaDialogInfo = {
    add: function (tagId, title) {return {id: tagId += '-add', title: title += '添加'};},
    edit: function (tagId, title) {return {id: tagId += '-infoPanel .iFBtnEditor', title: title += '修改'};}
};
//form提交将字符串转json
function getFormJson(id) {
    var o = {};
    var a = $("#"+id).serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}
/**
 * 报警滚动方法
 * @param id：标签Id
 * @param rollTime：滚动时间
 * @param time：动画效果时间
 * @returns {boolean}
 */
function callPoliceRoll(id, rollTime, time) {
	if (!id) {console.error('callPoliceRoll方法请传入id值');return false;}
    id += ' .callPoliceRoll-wrap';
	rollTime = rollTime ? rollTime : 3000;
	time = time ? time : 600;
    dojo.query(id).onmouseenter(function () {
        clearTimeout(callPoliceRollTime);
		clearTimeout(styleTime);
    });
    dojo.query(id).onmouseleave(function () {
        clearTimeout(callPoliceRollTime);
		clearTimeout(styleTime);
        callPoliceRoll(id.substring(0, id.indexOf(' ')));
    });
    callPoliceRollTime = setTimeout(function () {
        function rollFunction() {
            var callPolice = $(id + ' p:first-child');
            callPolice.css({overflow: 'hidden'}).animate({height: 0}, time);
            styleTime = setTimeout(function () {
                $(id).append(callPolice.removeAttr('style').remove());
                clearTimeout(styleTime);
                callPoliceRoll(id.substring(0, id.indexOf(' ')), rollTime, time);
            }, time);
        }
        rollFunction();
    }, rollTime);
}

/**
 * 下拉框事件方法
 * @param id：标签Id
 * @returns {boolean}
 */
function comboboxDFun (id) {
	if (!id) {console.error('combobox方法需要传入id值');return false}
	$(id + ' .iFComboBox').off('click').on('click', function () {
		if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
		var thisOne = this;
		if ($(this).hasClass('selected')) {
			$(this).removeClass('selected');
		} else {
			$(this).addClass('selected');
			$(this).find('.iFList').on('click', function () {
				if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
			}).find('li').off('click').on('click', function () {
				$(this).addClass('selected').siblings('.selected').removeClass('selected');
				$(thisOne).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
				$(thisOne).find('input').trigger('change');
			});
		}
	});
}
/**
 * 公司下拉框
 */
function fingba(){
	var xhrArgs = {
			url : basePath + "common/findba",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findbatj(comp_name){
	var xhrArgs = {
			url : basePath + "common/findbatj",
			postData : {
				"comp_name" : comp_name
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 小货车车牌下拉框
 */
function fingcp(){
	var xhrArgs = {
			url : basePath + "common/fingcp",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findcptj(cp_name){
	var xhrArgs = {
			url : basePath + "common/findcptj",
			postData : {
				"cp_name" : cp_name
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 小货车市区下拉框
 */
function findsq(){
	var xhrArgs = {
			url : basePath + "common/findsq",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findsqtj(sq_name){
	var xhrArgs = {
			url : basePath + "common/findsqtj",
			postData : {
				"sq_name" : sq_name
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 小货车业户名称下拉框
 */
function findyh(){
	var xhrArgs = {
			url : basePath + "common/findyh",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findyhtj(yh_name){
	var xhrArgs = {
			url : basePath + "common/findyhtj",
			postData : {
				"yh_name" : yh_name
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 小货车经营范围下拉框
 */
function findjyfw(){
	var xhrArgs = {
			url : basePath + "common/findjyfw",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 小货车车辆类型下拉框
 */
function findcllxxh(){
	var xhrArgs = {
			url : basePath + "common/findcllxxh",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 小货车车辆型号下拉框
 */
function findxh(){
	var xhrArgs = {
			url : basePath + "common/findxh",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findxhtj(cp_name){
	var xhrArgs = {
			url : basePath + "common/findxhtj",
			postData : {
				"cp_name" : cp_name
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 小货车燃料类型
 */
function findrllx(){
	var xhrArgs = {
			url : basePath + "common/findrllx",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 驾驶员所在区块
 */
function findsqm(){
	var xhrArgs = {
			url : basePath + "common/findsqm",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findsqmtj(sqm_name){
	var xhrArgs = {
			url : basePath + "common/findsqmtj",
			postData : {
				"sqm_name" : sqm_name
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 驾驶员电话号码
 */
function findphone(){
	var xhrArgs = {
			url : basePath + "common/findphone",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findphonetj(phone_name){
	var xhrArgs = {
			url : basePath + "common/findphonetj",
			postData : {
				"phone_name" : phone_name
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 驾驶员所在公司名
 */
function findgsm(){
	var xhrArgs = {
			url : basePath + "common/findgsm",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findgsmtj(cp_name){
	var xhrArgs = {
			url : basePath + "common/findgsmtj",
			postData : {
				"cp_name" : cp_name
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 违章执法区域
 */
function fingzfqy(){
	var xhrArgs = {
			url : basePath + "common/fingzfqy",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findzfqytj(qy_name){
	var xhrArgs = {
			url : basePath + "common/findzfqytj",
			postData : {
				"qy_name" : qy_name
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 违章执法机构
 */
function fingzfbm(){
	var xhrArgs = {
			url : basePath + "common/fingzfbm",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findzfbmtj(bm_name){
	var xhrArgs = {
			url : basePath + "common/findzfbmtj",
			postData : {
				"bm_name" : bm_name
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 所在县区
 */
function fingzfxq(){
	var xhrArgs = {
			url : basePath + "common/fingzfxq",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findzfxqtj(xq_name){
	var xhrArgs = {
			url : basePath + "common/findzfxqtj",
			postData : {
				"xq_name" : xq_name
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 违章车辆所在公司
 */
function findgsmc(){
	var xhrArgs = {
			url : basePath + "common/findgsmc",
			postData : '',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findgsmctj(gsm_name){
	var xhrArgs = {
			url : basePath + "common/findgsmctj",
			postData : {
				"gsm_name" : gsm_name
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 分公司下拉框
 */
function findcomp(ba_id){
//	if(ba_id ==""){return}
	var xhrArgs = {
			url : basePath + "common/findcomp",
			postData : {
				"ba_id" : ba_id
			},
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
function findcomp_tj(comp_name){
	var xhrArgs = {
			url : basePath + "common/findcomp_tj",
			postData : {
				"comp_name" : comp_name
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
* 车辆下拉框
*/
function findvhic(ba_id,comp_id){
	if(ba_id ==""||comp_id ==""){return}
	var xhrArgs = {
			url : basePath + "common/findvhic",
			postData : 'postData={"ba_id":"'+ba_id+'","comp_id":"'+comp_id+'"}',
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
function findvhictj(vhic){
	if(vhic ==""){return}
	var xhrArgs = {
			url : basePath + "common/findvhictj",
			postData : {
				"vhic" : vhic
			},
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
/**
*	区块下拉框
*/
function findqk(){
	var xhrArgs = {
			url : basePath + "common/findqk",
			postData : '',
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
/**
*	区域下拉框
*/
function findqy(){
	var xhrArgs = {
			url : basePath + "common/findqy",
			postData : '',
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 地图下拉框
 */
function finddt(){
	var xhrArgs = {
			url : basePath + "common/finddt",
			postData : '',
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 车辆类型下拉框
 */
function findcllx(){
	var xhrArgs = {
			url : basePath + "common/findcllx",
			postData : '',
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
function findcllxtj(info){
	var xhrArgs = {
			url : basePath + "common/findcllxtj",
			postData : {
				"info" : info
			},
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 车辆颜色下拉框
 */
function findclys(){
	var xhrArgs = {
			url : basePath + "common/findclys",
			postData : '',
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 车牌类型
 */
function findcplx(){
	var xhrArgs = {
			url : basePath + "common/findcplx",
			postData : '',
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 车辆状态
 */
function findclzt(){
	var xhrArgs = {
			url : basePath + "common/findclzt",
			postData : '',
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 车牌颜色
 */
function findcpys(){
	var xhrArgs = {
			url : basePath + "common/findcpys",
			postData : '',
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 终端类型
 */
function findzdlx(){
	var xhrArgs = {
			url : basePath + "common/findzdlx",
			postData : '',
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 终端型号
 */
function findzdxh(){
	var xhrArgs = {
			url : basePath + "common/findzdxh",
			postData : '',
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 终端型号findzdzt
 */
function findtxlx(){
	var xhrArgs = {
			url : basePath + "common/findtxlx",
			postData : '',
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 终端状态
 */
function findzdzt(){
	var xhrArgs = {
			url : basePath + "common/findzdzt",
			postData : '',
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
/**
 * 用户组权限
 */
function findqxlb(){
	var xhrArgs = {
			url : basePath + "common/findqxlb",
			postData : '',
			handleAs : "json"
		};
	return dojo.xhrPost(xhrArgs);
}
/**
*  下拉框通用方法，传入一个id、data  直接将内容放入下拉框
*/
function xlktyff(id,data){
	for(var i=0;i<data.length;i++){
		$("#"+id).append('<li data-value="'+data[i].id+'">'+data[i].name+'</li>');
	}
	selectonclick(id);
}

function selectonclick(id){
	$("#"+id).find('.iFList').on('click', function () {
		if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
	}).find('li').off('click').on('click', function () {
		$("#"+id).addClass('selected').siblings('.selected').removeClass('selected');
		$("#"+id).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
		$("#"+id).find('input').trigger('change');
	});
}
/**
*  下拉框通用和下拉框事件方法，传入一个id、data 直接将内容放入下拉框并且可以选中
*/
function xlktyffComboboxDFun(id,data){
	if(data!=null){
		var data = data.datas;
		$("#"+id).find('.iFList').html("");
		for (var i = 0; i < data.length; i++) {
			var cphms="<li data-value='"+data[i].id+"'>"+data[i].name+"</li>";
			$("#"+id).find('.iFList').append(cphms);
		}
		$("#"+id).find('.iFList').on('click', function () {
			if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
		}).find('li').off('click').on('click', function () {
			$("#"+id).addClass('selected').siblings('.selected').removeClass('selected');
			$("#"+id).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
			$("#"+id).find('input').trigger('keyup');
		});
	}
}
function qbqy(obj){
	if(!obj){
		return;
	}
	if(obj.indexOf('AT') >= 0){
		return "主城区";
	}else if(obj.indexOf('AH') >= 0||obj.indexOf('AAT') >= 0||obj.indexOf('AQT') >= 0||obj.indexOf('AUT') >= 0){
		return "余杭区";
	}else if(obj.indexOf('APT') >= 0||obj.indexOf('ALT') >= 0){
		return "萧山区";
	}else if(obj.indexOf('AB') >= 0||obj.indexOf('AEQ') >= 0){
		return "临安区";
	}else if(obj.indexOf('ACT') >= 0){
		return "富阳区";
	}
}
function xlktyff1(id,data){
	for(var i=0;i<data.length;i++){
		$("#"+id).append('<li data-value="'+data[i].id+'">'+data[i].name+'</li>');
	}
}

function onObjectError(){
	alert("控件加载失败，吃饭去");
}
//window.onbeforeunload = function(event) {
//	 CTIProxy.Logout();
//};
function findddcphm(obj){
	var xhrArgs = {
			url : basePath + "ddxpt/findcp",
			postData : 'postData={"keyword":"'+obj+'"}',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function findxhcddcphm(){
	var data = [{'CPHM' : '浙A1T638'},{'CPHM' : '浙A0T335'},{'CPHM' : '浙A0T378'},{'CPHM' : '浙A1T618'},{'CPHM' : '浙A2T009'},{'CPHM' : '浙A2T089'},{'CPHM' : '浙A1T671'}];
	return data;
}

function findallcp(){
	var xhrArgs = {
			url : basePath + "bjjkx/bjdata",
			postData : 'postData={}',
			handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findcd() {
	var xhrArgs = {
		url : basePath + "ddxpt/findcd",
		postData : 'postData={}',
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findcdcars(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/findcdcars",
		postData : 'postData={"tm_id":"' + obj + '"}',
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function addcd(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/addcd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
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
function jqfjq(obj) {
	if (obj == 0) {
		return "精确";
	} else {
		return "非精确";
	}
}
// 生成请求单号
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
function gettb(obj, b) {
	// 空车，重车，离线，任务车
	var wjj="car";
	if(obj.ISXH=="1"){
		wjj="xhcar";
	}
	if (b == 1) {
		if (obj.ANGLE == 0||obj.ANGLE == ""||obj.ANGLE == null||obj.ANGLE == undefined) {
			return "resources/images/"+wjj+"/z1.png";
		} else if (obj.ANGLE == 90) {
			return "resources/images/"+wjj+"/z2.png";
		} else if (obj.ANGLE == 180) {
			return "resources/images/"+wjj+"/z3.png";
		} else if (obj.ANGLE == 270) {
			return "resources/images/"+wjj+"/z4.png";
		} else if (obj.ANGLE > 0 && obj.ANGLE < 90) {
			return "resources/images/"+wjj+"/z5.png";
		} else if (obj.ANGLE > 90 && obj.ANGLE < 180) {
			return "resources/images/"+wjj+"/z6.png";
		} else if (obj.ANGLE > 180 && obj.ANGLE < 270) {
			return "resources/images/"+wjj+"/z7.png";
		} else if (obj.ANGLE > 270 && obj.ANGLE < 360) {
			return "resources/images/"+wjj+"/z8.png";
		}
	} else if (b == 3){
		if (obj.ANGLE == 0||obj.ANGLE == ""||obj.ANGLE == null||obj.ANGLE == undefined) {
			return "resources/images/carpic/k1.png";
		} else if (obj.ANGLE == 90) {
			return "resources/images/carpic/k2.png";
		} else if (obj.ANGLE == 180) {
			return "resources/images/carpic/k3.png";
		} else if (obj.ANGLE == 270) {
			return "resources/images/carpic/k4.png";
		} else if (obj.ANGLE > 0 && obj.ANGLE < 90) {
			return "resources/images/carpic/k5.png";
		} else if (obj.ANGLE > 90 && obj.ANGLE < 180) {
			return "resources/images/carpic/k6.png";
		} else if (obj.ANGLE > 180 && obj.ANGLE < 270) {
			return "resources/images/carpic/k7.png";
		} else if (obj.ANGLE > 270 && obj.ANGLE < 360) {
			return "resources/images/carpic/k8.png";
		}
	} else if (b == 2){
		if (obj.onoffstate == "1") {
			if (obj.CARSTATE == 0) {// 空车
				if (obj.ANGLE == 0||obj.ANGLE == ""||obj.ANGLE == null||obj.ANGLE == undefined) {
					return "resources/images/"+wjj+"/k1.png";
				} else if (obj.ANGLE == 90) {
					return "resources/images/"+wjj+"/k2.png";
				} else if (obj.ANGLE == 180) {
					return "resources/images/"+wjj+"/k3.png";
				} else if (obj.ANGLE == 270) {
					return "resources/images/"+wjj+"/k4.png";
				} else if (obj.ANGLE > 0 && obj.ANGLE < 90) {
					return "resources/images/"+wjj+"/k5.png";
				} else if (obj.ANGLE > 90 && obj.ANGLE < 180) {
					return "resources/images/"+wjj+"/k6.png";
				} else if (obj.ANGLE > 180 && obj.ANGLE < 270) {
					return "resources/images/"+wjj+"/k7.png";
				} else if (obj.ANGLE > 270 && obj.ANGLE < 360) {
					return "resources/images/"+wjj+"/k8.png";
				}
			} else {// 重车
				if (obj.ANGLE == 0||obj.ANGLE == ""||obj.ANGLE == null||obj.ANGLE == undefined) {
					return "resources/images/"+wjj+"/z1.png";
				} else if (obj.ANGLE == 90) {
					return "resources/images/"+wjj+"/z2.png";
				} else if (obj.ANGLE == 180) {
					return "resources/images/"+wjj+"/z3.png";
				} else if (obj.ANGLE == 270) {
					return "resources/images/"+wjj+"/z4.png";
				} else if (obj.ANGLE > 0 && obj.ANGLE < 90) {
					return "resources/images/"+wjj+"/z5.png";
				} else if (obj.ANGLE > 90 && obj.ANGLE < 180) {
					return "resources/images/"+wjj+"/z6.png";
				} else if (obj.ANGLE > 180 && obj.ANGLE < 270) {
					return "resources/images/"+wjj+"/z7.png";
				} else if (obj.ANGLE > 270 && obj.ANGLE < 360) {
					return "resources/images/"+wjj+"/z8.png";
				}
			}
		} else { // 离线
			if (obj.ANGLE == 0||obj.ANGLE == ""||obj.ANGLE == null||obj.ANGLE == undefined) {
				return "resources/images/"+wjj+"/l1.png";
			} else if (obj.ANGLE == 90) {
				return "resources/images/"+wjj+"/l2.png";
			} else if (obj.ANGLE == 180) {
				return "resources/images/"+wjj+"/l3.png";
			} else if (obj.ANGLE == 270) {
				return "resources/images/"+wjj+"/l4.png";
			} else if (obj.ANGLE > 0 && obj.ANGLE < 90) {
				return "resources/images/"+wjj+"/l5.png";
			} else if (obj.ANGLE > 90 && obj.ANGLE < 180) {
				return "resources/images/"+wjj+"/l6.png";
			} else if (obj.ANGLE > 180 && obj.ANGLE < 270) {
				return "resources/images/"+wjj+"/l7.png";
			} else if (obj.ANGLE > 270 && obj.ANGLE < 360) {
				return "resources/images/"+wjj+"/l8.png";
			}
		}
	}
}

function bjdata() {
	var xhrArgs = {
		url : basePath + "bjjkx/bjdata",
		postData : "postData={}",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function dddata() {
	var xhrArgs = {
		url : basePath + "ddxpt/kcdata",
		postData : "postData={}",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
//爱心调度页面车辆
function axdd(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/axdd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function queryAxddOrder(obj0,obj1,obj2,obj3,obj4,obj5) {
	var xhrArgs = {
		url : basePath + "ddxpt/queryaxddorder",
		postData : "postData={'stime':'"+obj0+"','etime':'"+obj1+"','dh':'" + obj2 + "','cp':'" + obj3 + "','bh':'" + obj4 + "','dz':'"+obj5+"'}",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function qxAxddOrder(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/qxaxddorder",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function delAxddOrder(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/delaxddorder",
		postData :"postData={'ids':'"+obj+"'}",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function editAxddOrder(pdata) {
	var xhrArgs = {
		url : basePath + "ddxpt/editaxddorder",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(pdata))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function pjAxddOrder(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/pjaxddorder",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function axdddata() {
	var xhrArgs = {
		url : basePath + "ddxpt/axkcdata",
		postData : "postData={}",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function queryCompByVehino(cp) {
	var xhrArgs = {
		url : basePath + "ddxpt/queryCompByVehino",
		postData : {"cp":cp},
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function findclxx(mdtno) {
	var xhrArgs = {
		url : basePath + "ddxpt/findclxx",
		postData : {"mdtno":mdtno},
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

//孝心业务
function editXxddOrder(pdata) {
	var xhrArgs = {
		url : basePath + "xxyw/xxywZpcl",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(pdata))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function delXxddOrder(pdata) {
	var xhrArgs = {
		url : basePath + "xxyw/xxywQxdd",
		postData :"postData=" + encodeURI(encodeURI(JSON.stringify(pdata))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

// 调度构建自定义信息窗体
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

// 调度构建自定义信息窗体
function axcreateInfoWindow(title, content) {
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
	closeX.onclick = axcloseInfoWindow;

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

//报警构建自定义信息窗体
function bjcreateInfoWindow(title, content) {
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
	closeX.onclick = bjcloseInfoWindow;

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
// 新调度关闭信息窗体
function closeInfoWindow() {
	xddjsobj.closeInfoWindow();
}
function axcloseInfoWindow() {
	axddjsobj.closeInfoWindow();
}
//报警关闭信息窗体
function bjcloseInfoWindow() {
	bjjkxjsobj.closeInfoWindow();
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
function senddx(obj) { // 1乘客
	var xhrArgs = {
		url : basePath + "ddxpt/senddx",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}


//地图经纬度附近车辆
function findfjcl(obj){
	var xhrArgs = {
		url : basePath + "ddxpt/fjcl",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
//定位监控车辆
function dwjkcl(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/dwjkcl",
		postData : "cp=" + obj,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

/**获取重点区域
 * */
function findKeyArea() {
	var xhrArgs = {
		url : basePath + "zhyw/findKeyArea",
		postData : {},
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

//callcenterjs

var callstate="";
var voicestate=-1;
//来电
// function CallIncommingEvt(ANI){
function CallIncommingEvt(EDUID,ANI,DNIS,UUI,UCID){
	voicestate = 2;
	// console.log('EDUID',EDUID);
	// console.log('ANI',ANI);
	// console.log('DNIS',DNIS);
	// console.log('UUI',UUI);
	// console.log('UCID',UCID);
	// console.log("坐席来电1--电话="+ANI);
	if(DNIS=='4613'||DNIS=='4617'){
		$("#xddldlx").html("1-出租约车");
	}else if(DNIS=='4614'||DNIS=='4618'){
		$("#xddldlx").html("2-爱心出租");
	}else if(DNIS=='4624'){
		$("#xddldlx").html("3-取消约车");
	}else if(DNIS=='4636'){
		$("#xddldlx").html("7-曹操爱心车队");
	}else if(DNIS=='4615'||DNIS=='4619'){
		$("#xddldlx").html("4-咨询投诉");
	}else if(DNIS=='4616'||DNIS=='4620'){
		$("#xddldlx").html("5-查找失物");
	}else if(DNIS=='4670'||DNIS=='28097099'){
		$("#xddldlx").html("6-出租集团");
		$('.icon-yytz').parent().trigger("click");
		$('#zx-sldx').val('出租集团');
		$('#zx-cllxBox').css('display','none');
		$('#zx-cllxBox2').css('display','inline-block');
		$('#zx-tslxBox2').css('display','none');
	}else{
		$("#xddldlx").html(DNIS);
	}
	$("#dhdqzt").html("来电中");
	$("#xddldhm").val(ANI);
	$("#xddhbdh").val(ANI);
	$("#xddfjxx").val(ANI);
	$("#xddldhm-combobox").find('.iFList').append("<li data-value='"+ANI+"'>"+ANI+"</li>");
//	if($("#xddldhm-combobox").find('.iFList').find('li').length>5){
//		$($("#xddldhm-combobox").find('.iFList').find('li')[5]).remove();
//	}
	addEventComboBoxList('#xddldhm-combobox');
	xddjsobj.xddldjl(ANI);
	// axddjsobj.axddldjl(ANI);
	$("#zx-ldhm").val(ANI);
	$("#axddldhm").val(ANI);
}
//电话接听事件di
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
	if(voicestate==2){
		CTIProxy.Hold();
	}else if(voicestate==3){
		CTIProxy.Hold();
	}
}

//会议开始
function CallHoldEvt(PhoneNum){
//	if(voicestate==2){
//		CTIProxy.StartConference(PhoneNum);
//	}else if(voicestate==3){
//		CTIProxy.StartConference(PhoneNum);
//	}
}

//会议完成
function CompleteConferenceEvt(PhoneNum){
	if(voicestate==2){
		CTIProxy.Retrieve();
	}else if(voicestate==3){
		CTIProxy.Retrieve();
	}
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
//	$(id).find('.iFList').on('click', function () {
//		if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
//	}).find('li').off('click').on('click', function () {
//		$(this).addClass('selected').siblings('.selected').removeClass('selected');
//		$(id).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
//	});
	
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
		html+= '<p>'+item+'</p><br>';
	}
	return html;
}