function findddcphm(obj) {
	var xhrArgs = {
		url : "ddxpt/findcp",
		postData : 'postData={"keyword":"' + obj + '"}',
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findcd() {
	var xhrArgs = {
		url : "ddxpt/findcd",
		postData : 'postData={}',
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findcdcars(obj) {
	var xhrArgs = {
		url : "ddxpt/findcdcars",
		postData : 'postData={"tm_id":"' + obj + '"}',
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function addcd(obj) {
	var xhrArgs = {
		url : "ddxpt/addcd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 返回地理编码geocoder
function getgeocoder() {
	var geocoder = new AMap.Geocoder({
		radius : 1000,
		extensions : "all"
	});
	return geocoder;
}
// //刷新获取报警信息（建立websocket）
// var websocket=null;
// var ipadd="127.0.0.1:8080";
// if ('WebSocket' in window) {
// websocket = new WebSocket("ws://"+ipadd+"/ddpt/websocket/"+username+"/xdd");
// // reconnect();
// } else {
// alert('Not support websocket');
// }
// //连接发生错误的回调方法
// websocket.onerror = function() {
// setMessageInnerHTML("WebSocket连接发生错误");
// };
// //连接成功建立的回调方法
// websocket.onopen = function(event) {
// setMessageInnerHTML("WebSocket连接成功");
// };
// //接收到消息的回调方法
// websocket.onmessage = function(event) {
// if(event.data==username){
// xddjsobj.findywd();
// }
// setMessageInnerHTML(event.data);
// };
// //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
// window.onbeforeunload = function () {
// closeWebSocket();
// };
// //将消息显示在网页上
// function setMessageInnerHTML(innerHTML) {
// console.log(innerHTML);
// };
// //关闭连接
// function closeWebSocket() {
// websocket.close();
// };
//
// //连接关闭的回调方法 断线重连 长连接
// websocket.onclose = function() {
// setMessageInnerHTML("WebSocket连接close");
// webSocket = null;
// // 重试10次，每次之间间隔10秒
// var tryTime=0;
// if (tryTime < 10) {
// setTimeout(function() {
// if(webSocket==null){
// tryTime++;
// websocket = new WebSocket("ws://"+ipadd+"/ddpt/websocket/"+username+"/xdd");
// }
// }, 500);
// } else {
// tryTime = 0;
// }
// };
// function reconnect(){
// setInterval(function() {
// if(!webSocket){
// websocket = new WebSocket("ws://"+ipadd+"/ddpt/websocket/"+username+"/xdd");
// };
// }, 5000);
// };
// end websocket
// ----------------start 查询业务单信息----------------

var username="";
var userrole="";
var userfjh="";
var host = "192.168.0.102";
var port = 61614;
var clientID = "";
var destination = "hz_jiaochefanhui_11";
var destination1 = "hz_taxi_905_gd";// 报警队列
var destination2 = "hz_chakuzt_14";// 下单队列
var destination3 = "hz_quxiaoyuechefanhui_12"; // 取消约车
var client;
var dxclcs = 0;
var isus="";//下发信息的车辆终端
//语音
//登陆坐席语音
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
//当前电话EDUID
var EDUID = null;


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
		    	 clientID = data.username;
		    	 userfjh = data.userfjh;
		    	 userrole = data.userrole;
		    	 connectMQ(clientID);
		    	 deviceId = data.userfjh;
		    	 
		    	 agentId = "hz"+data.username;
		    	 if (!!window.ActiveXObject || "ActiveXObject" in window){
		    		 InitializationBind();
		    	 }
	     },
	     error:function(data){
	     }
	 });
}



// mq客户端监听～～～～～～～～～～～

function connectMQ(clientID) {
	console.log(2222,clientID);
	client = new Messaging.Client(host, Number(port), clientID);
	client.onMessageArrived = function(e) {
		console.log("接收到的消息" + e.payloadString);
		var xxjson = JSON.parse(e.payloadString);
		console.log(xxjson);
		if (xxjson.cmd == "13") {// 接收到的是调度状态变更
			if (xxjson.qxzt == "1") {
				$(".qdxx").prepend(
						"<p class=''>" + xxjson.cphm + "-" + xxjson.disp_id
								+ "," + xxjson.sj + ",派车确认</p>");
				xddjsobj.findywd();
			} else if (xxjson.qxzt == "0") {
				if (xxjson.qq_id.indexOf(username) > -1) {
					xddjsobj.findywd();
				}
			} else if (xxjson.qxzt == "2") {
				xddjsobj.findywd();
			}
		} else if (xxjson.cmd.indexOf('0x0200') > -1) {
			if (xxjson.cmd == "0x0200_1") {
				$("#bjxx").prepend(
						'<li><a class="bjxx-red" href="javascript:void(0)">'
								+ xxjson.vehi_no + ' &nbsp;&nbsp;'
								+ xxjson.stime + '</a></li>');
			} else {
				$("#bjxx").prepend(
						'<li><a class="bjxx-black" href="javascript:void(0)">'
								+ xxjson.vehi_no + ' &nbsp;&nbsp;'
								+ xxjson.stime + '</a></li>');
			}
		} else if (xxjson.cmd.indexOf('0x8300') > -1) {
//			var isusarr = isus.split(",");
//			console.log(isusarr);
//			for (var i = 0; i < isusarr.length; i++) {
//				isusarr.removeByValue(xxjson.isu);
//			}
			
			if (isus.indexOf(xxjson.isu) > -1) {
				if(xxjson.result==0){
					layer.msg('消息下发成功！');
				}else{
					layer.msg('消息下发失败！');
				}
			} 
		} else if (xxjson.cmd == '14' && xxjson.qq_id.indexOf(username) > -1) {
			layer.msg('调度成功！');
			xddjsobj.findywd();
			xddjsobj.clearDD();
		} else if (xxjson.cmd == '12') {
			if (xxjson.qq_id.indexOf(username) > -1) {
				if (xxjson.qxzt == '0') {
					layer.msg('取消成功！');
				} else {
					layer.msg('取消失败！');
				}
			}
			xddjsobj.findywd();
		}
	};
	client.onConnectionLost = function(e) {
		console.log("消息队列连接已断开");
		$("#ddxpt-txzt").html("已断开");
		$("#ddxpt-txzt").css('color', 'red');
		dxclcs++;
		connectMQ(clientID);
	};
	client.connect({
		onSuccess : function() {
			client.subscribe(destination);
			client.subscribe(destination1);
			client.subscribe(destination2);
			client.subscribe(destination3);
			layer.msg("连接服务器成功！");
			$("#ddxpt-txzt").html("已连接");
			$("#ddxpt-txzt").css('color', '#37f38e');
			console.log("消息队列连接成功");
		},
		onFailure : function() {
			console.log("消息队列连接失败");
			$("#ddxpt-txzt").html("已断开");
			$("#ddxpt-txzt").css('color', 'red');
			dxclcs++;
			if (dxclcs > 5) {
				layer.msg("连接服务器失败，请检查网络！");
			} else
				connectMQ(clientID);
		}
	});
}
function queryOrder(obj1, obj2) {
	var xhrArgs = {
		url : "ddxpt/queryorder",
		postData : "postData={'gh':'" + username + "','qx':'" + userrole
				+ "','cp':'" + obj1 + "','bh':'" + obj2 + "'}",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 查询业务单信息----------------
// ----------------start 查询来电记录----------------

function queryLdjl(obj) {
	var xhrArgs = {
		url : "ddxpt/queryldjl",
		postData : "postData={'ldhm':'" + obj + "'}",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 查询来电记录----------------
// ----------------start 查询调度区域----------------

function queryDdqy(obj) {
	var xhrArgs = {
		url : "ddxpt/queryddqy",
		postData : "postData={}",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 查询调度区域----------------
// ----------------start 发送调度请求----------------

function xdd(obj) {
	var xhrArgs = {
		url : "ddxpt/xdd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 发送调度请求----------------
// ----------------start 重新调度请求----------------

function xddcxdd(obj) {
	var xhrArgs = {
		url : "ddxpt/cxdd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 重新调度请求----------------
// ----------------start 发送取消调度请求----------------

function qxdd(obj) {
	var xhrArgs = {
		url : "ddxpt/qxdd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 发送取消调度请求----------------
// ----------------start 发送黑名单----------------

function createHMD(obj) {
	var xhrArgs = {
		url : "ddxpt/createHMD",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 发送黑名单----------------

// 右键调度完成
function ddwc(obj) {
	var xhrArgs = {
		url : "ddxpt/ddwc",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 右键解除锁车
function jcsc(obj) {
	var xhrArgs = {
		url : "ddxpt/jcsc",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 右键手动催单
function sdcd(obj) {
	var xhrArgs = {
		url : "ddxpt/sdcd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 右键短信通知
function dxtz(obj) {
	var xhrArgs = {
		url : "ddxpt/dxtz",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 右键电话通知
function dhtz(obj) {
	var xhrArgs = {
		url : "ddxpt/dhtz",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 右键生成回程
function schc(obj) {
	var xhrArgs = {
		url : "ddxpt/schc",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 左键关闭菜单
$("body").bind("click", function() {
	xddjsobj.gbcd();
});

// 定位监控车辆
function dwjkcl(obj) {
	var xhrArgs = {
		url : "ddxpt/dwjkcl",
		postData : "cp=" + obj,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

// 生成新用户
function addxyh(obj) {
	var xhrArgs = {
		url : "ddxpt/addxyh",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 更新用户
function edityh(obj) {
	var xhrArgs = {
		url : "ddxpt/edityh",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

// 通知状态
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
	if (b == 1) {
		if (obj.ANGLE == 0) {
			return "resources/images/carpic/rwc1.png";
		} else if (obj.ANGLE == 90) {
			return "resources/images/carpic/rwc2.png";
		} else if (obj.ANGLE == 180) {
			return "resources/images/carpic/rwc3.png";
		} else if (obj.ANGLE == 270) {
			return "resources/images/carpic/rwc4.png";
		} else if (obj.ANGLE > 0 && obj.ANGLE < 90) {
			return "resources/images/carpic/rwc5.png";
		} else if (obj.ANGLE > 90 && obj.ANGLE < 180) {
			return "resources/images/carpic/rwc6.png";
		} else if (obj.ANGLE > 180 && obj.ANGLE < 270) {
			return "resources/images/carpic/rwc7.png";
		} else if (obj.ANGLE > 270 && obj.ANGLE < 360) {
			return "resources/images/carpic/rwc8.png";
		}
	} else if (b == 3){
		if (obj.ANGLE == 0) {
			return "resources/images/carpic/kcar1.png";
		} else if (obj.ANGLE == 90) {
			return "resources/images/carpic/kcar2.png";
		} else if (obj.ANGLE == 180) {
			return "resources/images/carpic/kcar3.png";
		} else if (obj.ANGLE == 270) {
			return "resources/images/carpic/kcar4.png";
		} else if (obj.ANGLE > 0 && obj.ANGLE < 90) {
			return "resources/images/carpic/kcar5.png";
		} else if (obj.ANGLE > 90 && obj.ANGLE < 180) {
			return "resources/images/carpic/kcar6.png";
		} else if (obj.ANGLE > 180 && obj.ANGLE < 270) {
			return "resources/images/carpic/kcar7.png";
		} else if (obj.ANGLE > 270 && obj.ANGLE < 360) {
			return "resources/images/carpic/kcar8.png";
		}
	} else if (b == 2){
		if (obj.onoffstate == "1") {
			if (obj.STATE == 0) {// 空车
				if (obj.ANGLE == 0) {
					return "resources/images/carpic/kcar1.png";
				} else if (obj.ANGLE == 90) {
					return "resources/images/carpic/kcar2.png";
				} else if (obj.ANGLE == 180) {
					return "resources/images/carpic/kcar3.png";
				} else if (obj.ANGLE == 270) {
					return "resources/images/carpic/kcar4.png";
				} else if (obj.ANGLE > 0 && obj.ANGLE < 90) {
					return "resources/images/carpic/kcar5.png";
				} else if (obj.ANGLE > 90 && obj.ANGLE < 180) {
					return "resources/images/carpic/kcar6.png";
				} else if (obj.ANGLE > 180 && obj.ANGLE < 270) {
					return "resources/images/carpic/kcar7.png";
				} else if (obj.ANGLE > 270 && obj.ANGLE < 360) {
					return "resources/images/carpic/kcar8.png";
				}
			} else {// 重车
				if (obj.ANGLE == 0) {
					return "resources/images/carpic/zcar1.png";
				} else if (obj.ANGLE == 90) {
					return "resources/images/carpic/zcar2.png";
				} else if (obj.ANGLE == 180) {
					return "resources/images/carpic/zcar3.png";
				} else if (obj.ANGLE == 270) {
					return "resources/images/carpic/zcar4.png";
				} else if (obj.ANGLE > 0 && obj.ANGLE < 90) {
					return "resources/images/carpic/zcar5.png";
				} else if (obj.ANGLE > 90 && obj.ANGLE < 180) {
					return "resources/images/carpic/zcar6.png";
				} else if (obj.ANGLE > 180 && obj.ANGLE < 270) {
					return "resources/images/carpic/zcar7.png";
				} else if (obj.ANGLE > 270 && obj.ANGLE < 360) {
					return "resources/images/carpic/zcar8.png";
				}
			}
		} else { // 离线
			if (obj.ANGLE == 0) {
				return "resources/images/carpic/lcar1.png";
			} else if (obj.ANGLE == 90) {
				return "resources/images/carpic/lcar2.png";
			} else if (obj.ANGLE == 180) {
				return "resources/images/carpic/lcar3.png";
			} else if (obj.ANGLE == 270) {
				return "resources/images/carpic/lcar4.png";
			} else if (obj.ANGLE > 0 && obj.ANGLE < 90) {
				return "resources/images/carpic/lcar5.png";
			} else if (obj.ANGLE > 90 && obj.ANGLE < 180) {
				return "resources/images/carpic/lcar6.png";
			} else if (obj.ANGLE > 180 && obj.ANGLE < 270) {
				return "resources/images/carpic/lcar7.png";
			} else if (obj.ANGLE > 270 && obj.ANGLE < 360) {
				return "resources/images/carpic/lcar8.png";
			}
		}
	}
}
// 构建自定义信息窗体
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
// 关闭信息窗体
function closeInfoWindow() {
	xddjsobj.closeInfoWindow();
}
// 短信发送信息
function getdxxx(obj) { // 1乘客，2 司机
	var xhrArgs = {
		url : "ddxpt/getdxxx",
		postData : "dxlx=" + obj,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function senddx(obj) { // 1乘客
	var xhrArgs = {
		url : "ddxpt/senddx",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function sendcldx(obj) { // 司机
	isus = obj.isu;
	var xhrArgs = {
		url : "ddxpt/sendcldx",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 积分管理
// 1.未接到客人
function jfgl(obj) {
	var xhrArgs = {
		url : "ddxpt/jfgl",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 监控信息
function jkcl(cps) {
	var xhrArgs = {
		url : "ddxpt/jkcl",
		postData : "cp=" + cps,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

// ----------------------------咨询----------------------------
function querycllx(obj) {
	var xhrArgs = {
		url : "ddxpt/querycllx",
		postData : "gjz=" + obj,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function createZX(obj) {
	var xhrArgs = {
		url : "ddxpt/createZX",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function findbyzxld(obj) {
	var xhrArgs = {
		url : "ddxpt/findbyld",
		postData : "zxld=" + obj,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function findallzx(obj) {
	var xhrArgs = {
		url : "ddxpt/findallzx",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function delbyzxid(obj) {
	var xhrArgs = {
		url : "ddxpt/delbyzxid",
		postData : "zxids=" + obj,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

// 积分查询处理
// 积分清零
function jfql(obj) {
	var xhrArgs = {
		url : "ddxpt/jfql",
		postData : "vehi_no=" + obj,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 积分补单
function findjfbd(obj) {

	var xhrArgs = {
		url : "ddxpt/jfbd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 积分明细
function findjfmx(obj) {
	var xhrArgs = {
		url : "ddxpt/jfmx",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}


//地图经纬度附近车辆
function findfjcl(obj){
	var xhrArgs = {
		url : "ddxpt/fjcl",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}


// 第一次加载就登陆
//window.InitializationBind();
function InitializationBind() {
	setTimeout("SendLogin()", 500);
}
// 登录
var status = null;
function SendLogin() {
	// 返回0初始化成功，其他表示失败
	// alert(url);
	var a = CTIProxy.Init(url, url);
	// alert(2);
	console.log("初始化--" + a);
	setTimeout("timelogin()", 500);
}
function timelogin() {
	// 登陆请求(帐号,密码,分机号码)返回1成功,其他失败
	console.log(agentId + "  " + pwd + "  " + deviceId);
	var a = CTIProxy.Login(agentId, pwd, deviceId);
	console.log("登陆--" + a);
}
// 退出
function SendLogout() {
	var a = CTIProxy.Logout();
	if (a == 1) {
		layer.msg("坐席退出");
	} else {
		layer.msg("坐席退出失败");
	}
}
// 离席
function ZhimangAUX() {
	var a = CTIProxy.MakeAUX("0");
	console.log("置忙--" + a);
}
// 就绪
function SendAvailable() {
	var a = CTIProxy.MakeAvailable();
	console.log("就绪--" + a);
}
// 电话外拨
function SendMakeCall(dh) {
	PhoneType = "2";
	CTIProxy.MakeCall(("9" + dh));
}
// 保持电话
function ContinueCall() {
	CTIProxy.HoldCall();
}
// 恢复
function CompleteCall() {
	CTIProxy.Retrieve();
}
// 电话会议
function SendBeginConference(dh) {
	PhoneType = "2";
	CTIProxy.BeginConference(dh, "1");
}
// 发送会议完成
function SendCompleteConference() {
	CTIProxy.CompleteConference();
}
// 发送会议取消
function SendCancelConference() {
	CTIProxy.CancelConference();
}

// OCX控件事件触发
addEvent(CTIProxy);
function addEvent(element) {
	if (element.attachEvent) {
		console.log("IE10以下版本，再写");
		//坐席登陆事件
		element.attachEvent("LogInEvt", function(dlgh) {
			console.log("坐席登陆成功--工号="+dlgh);
			$("#dhdqzt").html("置忙");
		});
		//坐席置忙
		element.attachEvent("AgentAUXEvt", function(dlgh) {
			console.log("坐席置忙成功--工号="+dlgh);
			$("#dhdqzt").html("置忙");
		});
		//坐席置闲
		element.attachEvent("AgentWorkEvt", function(dlgh) {
			console.log("坐席置闲成功--工号="+dlgh);
			$("#dhdqzt").html("置闲");
		});
		//来电事件
		element.attachEvent("CallIncommingEvt", function(EDUID, ANI, DNIS, UUI, UCID) {
			console.info(EDUID, ANI, DNIS, UUI, UCID);
			console.log("坐席来电1--电话="+EDUID);
			$("#dhdqzt").html("来电中");
			$("#xddldhm").val(EDUID);
			$("#xddhbdh").val(EDUID);
			xddjsobj.xddldjl(EDUID);
			PhoneType="1";
			$("#zx-ldhm").val(EDUID);
		});
		//电话接通事件
		element.attachEvent("CallConnectEvt", function(EDUID, ANI, DNIS, UCID) {
			console.log("电话接通--来电="+EDUID);
			$("#dhdqzt").html("正在通话");
			if(PhoneType=="1"){
				var UUI ="{FUNC:'playagent',AGENTID:'"+"hz"+username+"'}";
				CTIProxy.BeginConference("4800", UUI);
			}
			PhoneType="1";
		});
		//挂机事件
		element.attachEvent("CallDisconnectEvt", function(PhoneNum) {
			console.log("电话挂机--分机号="+PhoneNum);
			$("#dhdqzt").html("置闲");
		});
	} else if (element.addEventListener) {
		console.log("IE11·····");
		//坐席登陆事件
		element.addEventListener("LogInEvt", function(dlgh) {
			console.log("坐席登陆成功--工号="+dlgh);
			$("#dhdqzt").html("置忙");
		}, false);
		//坐席置忙
		element.addEventListener("AgentAUXEvt", function(dlgh) {
			console.log("坐席置忙成功--工号="+dlgh);
			$("#dhdqzt").html("置忙");
		}, false);
		//坐席置闲
		element.addEventListener("AgentWorkEvt", function(dlgh) {
			console.log("坐席置闲成功--工号="+dlgh);
			$("#dhdqzt").html("置闲");
		}, false);
		//来电事件
		element.addEventListener("CallIncommingEvt", function(EDUID, ANI, DNIS, UUI, UCID) {
			console.log("坐席来电--电话="+ANI);
			$("#dhdqzt").html("来电中");
			$("#xddldhm").val(ANI);
			xddjsobj.xddldjl(ANI);
			$("#zx-ldhm").val(ANI);
			PhoneType="1";
		}, false);
		//电话接通事件
		element.addEventListener("CallConnectEvt", function(EDUID, ANI, DNIS, UCID) {
			console.log("电话接通--来电="+ANI);
			$("#dhdqzt").html("正在通话");
			if(PhoneType=="1"){
				var UUI ="{FUNC:'playagent',AGENTID:'"+"hz"+username+"'}";
				CTIProxy.BeginConference("4800", UUI);
			}
			PhoneType="1";
		}, false);
		//挂机事件
		element.addEventListener("CallDisconnectEvt", function(PhoneNum) {
			console.log("电话挂机--分机号="+PhoneNum);
			$("#dhdqzt").html("置闲");
		}, false);
	}
}
