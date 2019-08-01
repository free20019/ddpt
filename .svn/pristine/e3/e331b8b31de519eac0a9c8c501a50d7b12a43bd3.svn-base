

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
function connectMQ(clientID){
	client = new Messaging.Client(host,Number(port),clientID);
	client.onMessageArrived = function(e){
		console.log("接收到的消息"+e.payloadString);

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
						'<li><a class="bjxx-red" href="index-bjjkx.html?cp='+xxjson.vehi_no+'" target="_blank">'
								+ xxjson.vehi_no + ' &nbsp;&nbsp;紧急报警</a></li>');
				
			} else if(xxjson.cmd == "0x0200_13"){
				$("#bjxx").prepend(
						'<li><a class="bjxx-black" href="javascript:void(0)">'
								+ xxjson.vehi_no + ' &nbsp;&nbsp;越界报警</a></li>');
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
		//connectMQ(clientID);
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
//			layer.msg("该工号已连接消息队列！");
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
		url : basePath + "ddxpt/queryorder",
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
		url : basePath + "ddxpt/queryldjl",
		postData : "postData={'ldhm':'" + obj + "'}",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 查询来电记录----------------
// ----------------start 查询调度区域----------------

function queryDdqy(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/queryddqy",
		postData : "postData={}",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 查询调度区域----------------
// ----------------start 发送调度请求----------------

function xdd(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/xdd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 发送调度请求----------------
// ----------------start 重新调度请求----------------

function xddcxdd(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/cxdd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 重新调度请求----------------
// ----------------start 发送取消调度请求----------------

function qxdd(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/qxdd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 发送取消调度请求----------------
// ----------------start 发送黑名单----------------

function createHMD(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/createHMD",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 发送黑名单----------------

// 右键调度完成
function ddwc(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/ddwc",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 右键解除锁车
function jcsc(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/jcsc",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 右键手动催单
function sdcd(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/sdcd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 右键短信通知
function dxtz(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/dxtz",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 右键电话通知
function dhtz(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/dhtz",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 右键生成回程
function schc(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/schc",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 左键关闭菜单
$("body").bind("click", function() {
	xddjsobj.gbcd();
});


// 生成新用户
function addxyh(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/addxyh",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 更新用户
function edityh(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/edityh",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function sendcldx(obj) { // 司机
	isus = obj.isu;
	var xhrArgs = {
		url : basePath + "ddxpt/sendcldx",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

// 积分管理
// 1.未接到客人
function jfgl(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/jfgl",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 监控信息
function jkcl(cps) {
	var xhrArgs = {
		url : basePath + "ddxpt/jkcl",
		postData : "cp=" + cps,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
var rwcdata=[];
function getddtb(obj){
	var rwccp="";
	for (var i = 0; i < rwcdata.length; i++) {
		rwccp +=rwcdata[i].VEHI_NO+";"
	}
	if(rwccp.indexOf(obj.vehino)>-1){
		if (obj.heading==""||obj.heading==null||obj.heading == 0) {
			return "resources/images/car/z1.png";
		} else if (obj.heading == 90) {
			return "resources/images/car/z2.png";
		} else if (obj.heading == 180) {
			return "resources/images/car/z3.png";
		} else if (obj.heading == 270) {
			return "resources/images/car/z4.png";
		} else if (obj.heading > 0 && obj.heading < 90) {
			return "resources/images/car/z5.png";
		} else if (obj.heading > 90 && obj.heading < 180) {
			return "resources/images/car/z6.png";
		} else if (obj.heading > 180 && obj.heading < 270) {
			return "resources/images/car/z7.png";
		} else if (obj.heading > 270 && obj.heading < 360) {
			return "resources/images/car/z8.png";
		}
	}else{
		if (obj.heading==""||obj.heading==null||obj.heading == 0) {
			return "resources/images/car/k1.png";
		} else if (obj.heading == 90) {
			return "resources/images/car/k2.png";
		} else if (obj.heading == 180) {
			return "resources/images/car/k3.png";
		} else if (obj.heading == 270) {
			return "resources/images/car/k4.png";
		} else if (obj.heading > 0 && obj.heading < 90) {
			return "resources/images/car/k5.png";
		} else if (obj.heading > 90 && obj.heading < 180) {
			return "resources/images/car/k6.png";
		} else if (obj.heading > 180 && obj.heading < 270) {
			return "resources/images/car/k7.png";
		} else if (obj.heading > 270 && obj.heading < 360) {
			return "resources/images/car/k8.png";
		}
	}
}
// ----------------------------咨询----------------------------
function querycllx(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/querycllx",
		postData : "gjz=" + obj,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function createZX(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/createZX",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function findbyzxld(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/findbyld",
		postData : "zxld=" + obj,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function findallzx(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/findallzx",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function delbyzxid(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/delbyzxid",
		postData : "zxids=" + obj,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

// 积分查询处理
// 积分清零
function jfql(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/jfql",
		postData : "vehi_no=" + obj,
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 积分补单
function findjfbd(obj) {

	var xhrArgs = {
		url : basePath + "ddxpt/jfbd",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// 积分明细
function findjfmx(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/jfmx",
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
	addEvent(CTIProxy);
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
function addEvent(element) {
	if (element.attachEvent) {
		console.log("IE10以下版本");
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
			$("#xddfjxx").val(EDUID);
			
			$("#xddldhm-combobox").find('.iFList').append("<li data-value='"+EDUID+"'>"+EDUID+"</li>");
			if($("#xddldhm-combobox").find('.iFList').find('li').length>5){
				$($("#xddldhm-combobox").find('.iFList').find('li')[5]).remove();
			}
			xddjsobj.xddldjl(EDUID);
			PhoneType="1";
			$("#zx-ldhm").val(EDUID);
		});
		//电话接通事件
		element.attachEvent("CallConnectEvt", function(EDUID, ANI, DNIS, UCID) {
			console.log("电话接通--来电="+EDUID);
			$("#dhdqzt").html("正在通话");
			if(PhoneType=="1"){
				var UUI ="{FUNC:'playagent',AGENTID:'"+username+"'}";
				CTIProxy.BeginConference("4800", UUI);
			}
			PhoneType="1";
		});
		//挂机事件
		element.attachEvent("CallDisconnectEvt", function(PhoneNum) {
			console.log("电话挂机--电话号码="+PhoneNum);
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

$(function(){
	var items=document.getElementsByName('xddinput');  
    var item=null;  
    for(var i=0;i<items.length;i++){  
         item=items[i];  
        (function () {  
           var next=(i+1) < items.length ? i+1 : 0 ;  
         item.onkeydown=function(event){  
             var eve=event ? event : window.event;  
             if(eve.keyCode==13){  
                   items[next].focus();  
             }  
         }  
         })();  
    }
});
