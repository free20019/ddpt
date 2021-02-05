var gzcl="",yjccl = "",lovecls="";
var username = "";
var userrole = "";
var userfjh = "";
var host = "192.168.0.102";
var port = 61614;
var clientID = "";
var destination = "hz_jiaochefanhui_11";
var destination1 = "hz_taxi_905_gd";// 报警队列
var destination2 = "hz_chakuzt_14";// 下单队列
var destination3 = "hz_quxiaoyuechefanhui_12"; // 取消约车
var destination4 = "yy";
var dxclcs = 0;
var isus = "";// 下发信息的车辆终端
var bjclMapList = [];
// 语音
// 登陆坐席语音
// 分机号码
var deviceId = "";
// 工号(帐号)
var agentId = "";
// 坐席密码
var pwd = "s123456";
// ic 服务器url地址
var url = "http://192.168.0.55:9700/icsdk";
// 是否播报工号
var ConferenceStatus = "0";
// 电话接通类型（外拨：2，来电：1）
var PhoneType = "1";
// 当前电话EDUID
var EDUID = null;
checklogin();
function checklogin() {
	$.ajax({
		url : basePath + "login/checklogin",
		type : 'post',
		data : {},
		async : false,
		dataType : 'json',
		success : function(data) {
			// console.info(data);
			username = data.username;
			callgh = data.username;
			clientID = "dd" + data.username;
			userfjh = data.userfjh;
			userrole = data.userrole;
			connectMQ(clientID);
			deviceId = data.userfjh;
			agentId = "hz" + data.username;
			if (!!window.ActiveXObject || "ActiveXObject" in window) {
				$("#ddxpt-hjzx").html("连接中");
				$("#ddxpt-hjzx").css('color', '#37f38e');
				InitializationBind();
			}
		},
		error : function(data) {
		}
	});
}
// mq客户端监听～～～～～～～～～～～
function connectMQ(clientID) {
	var meclientID = clientID + "-" + Math.floor(Math.random() * 100000)
	client = new Messaging.Client(host, Number(port), meclientID);
	client.onMessageArrived = function(e) {
		// console.log("接收到的消息"+e.payloadString);
		var xxjson = JSON.parse(e.payloadString);
		if (xxjson.cmd == "13") {// 接收到的是调度状态变更
			if (xxjson.qxzt == "1") {
				$(".qdxx").prepend(
						"<p class=''>" + xxjson.cphm + "-派车确认-"
								+ xxjson.disp_id + "," + xxjson.sj + "</p>");
				xddjsobj.findywd();
                //修改优惠券状态
				updateYhqIsuse(xxjson.disp_id);
			} else if (xxjson.qxzt == "0") {
				if (xxjson.qq_id.indexOf(username) > -1) {
					xddjsobj.findywd();
				}
			} else if (xxjson.qxzt == "2" || xxjson.qxzt == "3") {
				xddjsobj.findywd();
			}
		} else if (xxjson.cmd.indexOf('0x0200') > -1) {
			if (xxjson.cmd == "0x0200_1") {
				for (var i = 0; i < bjclMapList.length; i++) {
					var ycz = bjclMapList[i];
					if (ycz.cp == xxjson.vehi_no) {
						if(gzcl.indexOf(xxjson.vehi_no)>=0){

							$("#"+ycz.id).find('a').html(xxjson.vehi_no + '(故障)&nbsp;&nbsp;'+ formatsfm(xxjson.stime)+ '&nbsp;&nbsp;紧急报警');
							$("#"+ycz.id).find('a').addClass("bjxx-gray");
							$("#"+ycz.id).find('a').removeClass("bjxx-red");
						}else{
							$("#"+ycz.id).find('a').html(xxjson.vehi_no + '&nbsp;&nbsp;'+ formatsfm(xxjson.stime)+ '&nbsp;&nbsp;紧急报警');
							$("#"+ycz.id).find('a').addClass("bjxx-red");
							$("#"+ycz.id).find('a').removeClass("bjxx-gray");
						}
						if(yjccl.indexOf(xxjson.isu)>=0){
							$("#"+ycz.id).find('a').html(xxjson.vehi_no + '(已解除)&nbsp;&nbsp;'+ formatsfm(xxjson.stime)+ '&nbsp;&nbsp;紧急报警');
						}
						ycz.xsj = formatymrsfm(xxjson.stime);//最新报警时间
						var d1 = new Date(ycz.jsj);
						var d2 = new Date();
						if (parseInt(d2 - d1) / 1000 / 60 >= 30) {//超过30分钟重新生成报警信息
							bjclMapList.splice($.inArray(ycz, bjclMapList), 1);
							$("#" + ycz.id).remove();
							break;
						}
						return;
					}
				}
					var bjclMap = {};
					var bjid = createqqid();
					bjclMap.id = bjid;
					bjclMap.cp = xxjson.vehi_no;
					bjclMap.jsj = formatymrsfm(xxjson.stime);//最早报警时间
					bjclMap.xsj = formatymrsfm(xxjson.stime);//最新报警时间
					bjclMapList.push(bjclMap);
//				console.log(xxjson.isu,yjccl);
					if (gzcl.indexOf(xxjson.vehi_no) >= 0) {
						$("#bjxx").prepend('<li id="'
								+ bjid
								+ '"><a class="bjxx-gray" href="index-bjjkx.html" target="_blank">'
								+ xxjson.vehi_no + '(故障)&nbsp;&nbsp;'
								+ formatsfm(xxjson.stime)
								+ '&nbsp;&nbsp;紧急报警</a></li>');
					} else {
						if (yjccl.indexOf(xxjson.isu) >= 0) {
							$("#bjxx").prepend('<li id="'
									+ bjid
									+ '"><a class="bjxx-red" href="index-bjjkx.html" target="_blank">'
									+ xxjson.vehi_no + '(已解除)&nbsp;&nbsp;'
									+ formatsfm(xxjson.stime)
									+ '&nbsp;&nbsp;紧急报警</a></li>');
						} else {
							$("#bjxx").prepend('<li id="'
									+ bjid
									+ '"><a class="bjxx-red" href="index-bjjkx.html" target="_blank">'
									+ xxjson.vehi_no + '&nbsp;&nbsp;'
									+ formatsfm(xxjson.stime)
									+ '&nbsp;&nbsp;紧急报警</a></li>');
						}
					}
			} else if (xxjson.cmd == "0x0200_13") {
				$("#bjxx")
						.prepend(
								'<li><a class="bjxx-black" href="javascript:void(0)">'
										+ xxjson.vehi_no
										+ ' &nbsp;&nbsp;越界报警</a></li>');
			}
		} else if (xxjson.cmd.indexOf('0x8300') > -1) {
			if (isus.indexOf(xxjson.isu) > -1) {
				if (xxjson.result == 0) {
					layer.msg('消息下发成功！');
				} else {
					layer.msg('消息下发失败！');
				}
				xddjsobj.findywd();
				isus = "";
			}
		} else if (xxjson.cmd == '14' && xxjson.qq_id.indexOf(username) > -1) {
			layer.msg('下单成功！');
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
		$("#ddxpt-txzt").html("断开连接");
		$("#ddxpt-txzt").css('color', 'red');
		if (tcindex == 2) {
			dxclcs++;
			connectMQ(clientID);
		}
	};
	client.connect({
		onSuccess : function() {
			client.subscribe(destination);
			client.subscribe(destination1);
			client.subscribe(destination2);
			client.subscribe(destination3);
			// client.subscribe(destination4);
			layer.msg("连接服务器成功！");
			$("#ddxpt-txzt").html("已连接");
			tcindex = 2;
			$("#ddxpt-txzt").css('color', '#37f38e');
			console.log("消息队列连接成功");
		},
		onFailure : function() {
			// layer.msg("该工号已连接消息队列！");
			console.log("消息队列连接失败");
			$("#ddxpt-txzt").html("连接失败");
			$("#ddxpt-txzt").css('color', 'red');
			dxclcs++;
			if (dxclcs > 5) {
				layer.msg("连接服务器失败，请检查网络！");
			} else {
				connectMQ(clientID);
			}
		},
		cleanSession : false

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

function queryXxyw(obj1, obj2) {
	var xhrArgs = {
		url : basePath + "xxyw/queryorder",
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
// ----------------start 查询爱心调度附近车辆----------------
function findaxddfjcl(lo,la) {
	var xhrArgs = {
		url : basePath + "ddxpt/findaxddfjcl",
		postData : "postData={'lo':'" + lo + "','la':'" + la + "'}",
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
// ----------------end 查询爱心调度附近车辆----------------
// ----------------start 人工爱心调度----------------
function zxrgaxdd(obj) {
    var xhrArgs = {
        url : basePath + "ddxpt/zxrgaxdd",
        postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
        handleAs : "json"
    };
    return dojo.xhrPost(xhrArgs);
}
// ----------------end 人工爱心调度----------------
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
	isus = obj.isu;
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
var rwcdata = [];
function getddtb(obj) {
	var rwccp = "";
	for (var i = 0; i < rwcdata.length; i++) {
		rwccp += rwcdata[i].VEHI_NO + ";"
	}
	var wjj="car";
	if(obj.isxh=="1"){
		wjj="xhcar";
	}
	if (rwccp.indexOf(obj.vehino) > -1) {
			if (obj.heading == "" || obj.heading == null || obj.heading == 0) {
				return "resources/images/"+wjj+"/z1.png";
			} else if (obj.heading == 90) {
				return "resources/images/"+wjj+"/z2.png";
			} else if (obj.heading == 180) {
				return "resources/images/"+wjj+"/z3.png";
			} else if (obj.heading == 270) {
				return "resources/images/"+wjj+"/z4.png";
			} else if (obj.heading > 0 && obj.heading < 90) {
				return "resources/images/"+wjj+"/z5.png";
			} else if (obj.heading > 90 && obj.heading < 180) {
				return "resources/images/"+wjj+"/z6.png";
			} else if (obj.heading > 180 && obj.heading < 270) {
				return "resources/images/"+wjj+"/z7.png";
			} else if (obj.heading > 270 && obj.heading < 360) {
				return "resources/images/"+wjj+"/z8.png";
			}
	}if(lovecls.indexOf(obj.vehino)>-1){
			return "resources/images/lovecar.png";
	} else {
		if (obj.heading == "" || obj.heading == null || obj.heading == 0) {
			return "resources/images/"+wjj+"/k1.png";
		} else if (obj.heading == 90) {
			return "resources/images/"+wjj+"/k2.png";
		} else if (obj.heading == 180) {
			return "resources/images/"+wjj+"/k3.png";
		} else if (obj.heading == 270) {
			return "resources/images/"+wjj+"/k4.png";
		} else if (obj.heading > 0 && obj.heading < 90) {
			return "resources/images/"+wjj+"/k5.png";
		} else if (obj.heading > 90 && obj.heading < 180) {
			return "resources/images/"+wjj+"/k6.png";
		} else if (obj.heading > 180 && obj.heading < 270) {
			return "resources/images/"+wjj+"/k7.png";
		} else if (obj.heading > 270 && obj.heading < 360) {
			return "resources/images/"+wjj+"/k8.png";
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
function findonezx(obj) {
	var xhrArgs = {
		url : basePath + "ddxpt/findonezx",
		postData : "zxids=" + obj,
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
// window.InitializationBind();
function InitializationBind() {
	setTimeout("SendLogin()", 3000);
}
// 登录
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
	if (dh.length < 7) {
		CTIProxy.MakeCall(dh);
	} else {
		CTIProxy.MakeCall("9" + dh);
	}
}
// 保持电话
function ContinueCall() {
	CTIProxy.Hold();
}
// 恢复
function CompleteCall() {
	CTIProxy.Retrieve();
}
// 电话会议
var hydh="";
function SendBeginConference(dh) {
	hydh = dh;
	PhoneType = "2";
	console.log("voicestate="+voicestate);
	voicestate = "3";
	if (dh.length < 7) {
		CTIProxy.BeginConference(dh, "1");
	} else {
		CTIProxy.BeginConference("9" + dh, "1");
	}
}
// 发送会议完成
function SendCompleteConference() {
//	CTIProxy.CompleteConference();
	CTIProxy.CompleteConference();
}
// 发送会议取消
function SendCancelConference() {
	CTIProxy.CancelConference();
	CTIProxy.Retrieve();
}

// OCX控件事件触发
function addEvent() {
	if (CTIProxy.attachEvent) {
		console.log("IE10以下版本");
		// 坐席登陆事件
		CTIProxy.attachEvent("LogInEvt", function(dlgh) {
			console.log("坐席登陆成功--工号=" + dlgh);
			callstate = "置忙";
			$("#dhdqzt").html(callstate);
			$("#ddxpt-hjzx").html("已登录");
			$("#ddxpt-hjzx").css('color', '#37f38e');
		});
		// 坐席置忙
		CTIProxy.attachEvent("AgentAUXEvt", function(dlgh) {
			console.log("坐席置忙成功--工号=" + dlgh);
			callstate = "置忙";
			$("#dhdqzt").html(callstate);
		});
		// 坐席置闲
		CTIProxy.attachEvent("AgentWorkEvt", function(dlgh) {
			console.log("坐席置闲成功--工号=" + dlgh);
			callstate = "置闲";
			$("#dhdqzt").html(callstate);
		});
		// 来电事件
		CTIProxy.attachEvent("CallIncommingEvt", function(EDUID, ANI, DNIS,
				UUI, UCID) {
			console.info(EDUID, ANI, DNIS, UUI, UCID);
			console.log("坐席来电1--电话=" + ANI);
            xddjsobj.clearRGAXDD();
			$("#dhdqzt").html("来电中");
			$("#xddldhm").val(ANI);
			$("#xddhbdh").val(ANI);
			$("#xddfjxx").val(ANI);

			$("#xddldhm-combobox").find('.iFList').append(
					"<li data-value='" + ANI + "'>" + ANI + "</li>");
			if ($("#xddldhm-combobox").find('.iFList').find('li').length > 5) {
				$($("#xddldhm-combobox").find('.iFList').find('li')[5])
						.remove();
			}
			xddjsobj.xddldjl(ANI);
			PhoneType = "1";
			$("#zx-ldhm").val(ANI);
		});
		// 电话接通事件
		CTIProxy.attachEvent("CallConnectEvt",
				function(EDUID, ANI, DNIS, UCID) {
					console.log("电话接通--来电=" + ANI);
					$("#dhdqzt").html("正在通话");
					if (PhoneType == "1") {
						var UUI = "{FUNC:'playagent',AGENTID:'" + username
								+ "'}";
						CTIProxy.BeginConference("4800", UUI);
					}
					PhoneType = "1";
				});
		// 挂机事件
		CTIProxy.attachEvent("CallDisconnectEvt", function(PhoneNum) {
			console.log("电话挂机--电话号码=" + PhoneNum);
			$("#dhdqzt").html(callstate);
		});
	} else if (CTIProxy.addEventListener) {
		console.log("IE11·····");
		// 坐席登陆事件
		CTIProxy.addEventListener("LogInEvt", function(dlgh) {
			console.log("坐席登陆成功--工号=" + dlgh);
			$("#dhdqzt").html("置忙");
		}, false);
		// 坐席置忙
		CTIProxy.addEventListener("AgentAUXEvt", function(dlgh) {
			console.log("坐席置忙成功--工号=" + dlgh);
			$("#dhdqzt").html("置忙");
		}, false);
		// 坐席置闲
		CTIProxy.addEventListener("AgentWorkEvt", function(dlgh) {
			console.log("坐席置闲成功--工号=" + dlgh);
			$("#dhdqzt").html("置闲");
		}, false);
		// 来电事件
		CTIProxy.addEventListener("CallIncommingEvt", function(EDUID, ANI,
				DNIS, UUI, UCID) {
			console.log("坐席来电--电话=" + ANI);
			$("#dhdqzt").html("来电中");
			$("#xddldhm").val(ANI);
			xddjsobj.xddldjl(ANI);
			$("#zx-ldhm").val(ANI);
			PhoneType = "1";
		}, false);
		// 电话接通事件
		CTIProxy.addEventListener("CallConnectEvt", function(EDUID, ANI, DNIS,
				UCID) {
			console.log("电话接通--来电=" + ANI);
			$("#dhdqzt").html("正在通话");
			if (PhoneType == "1") {
				var UUI = "{FUNC:'playagent',AGENTID:'" + "hz" + username
						+ "'}";
				CTIProxy.BeginConference("4800", UUI);
			}
			PhoneType = "1";
		}, false);
		// 挂机事件
		CTIProxy.addEventListener("CallDisconnectEvt", function(PhoneNum) {
			console.log("电话挂机--分机号=" + PhoneNum);
			$("#dhdqzt").html("置闲");
		}, false);
	}
}

function formatsfm(obj) {
//	obj = "20" + obj;
	return obj.substring(8, 10) + ":" + obj.substring(10, 12) + ":"
			+ obj.substring(12, 14);
}
function formatymrsfm(obj) {
//	obj = "20" + obj;
	return obj.substring(0, 4) + "-" + obj.substring(4, 6) + "-"
			+ obj.substring(6, 8) + " " + obj.substring(8, 10) + ":"
			+ obj.substring(10, 12) + ":" + obj.substring(12, 14);
}
$(function() {
	var items = document.getElementsByName('xddinput');
	var item = null;
	for (var i = 0; i < items.length; i++) {
		item = items[i];
		(function() {
			var next = (i + 1) < items.length ? i + 1 : 0;
			item.onkeydown = function(event) {
				var eve = event ? event : window.event;
				if (eve.keyCode == 13) {
					items[next].focus();
				}
			}
		})();
	}
});
$("#bjxx").bind("contextmenu", function(){
    return false;
});
$("#bjxx").mousedown(function(e) {
    if (3 == e.which) {
        $("#bjxx").html("");
        bjclMapList=[];
    }
});


setInterval(function() {
	var templist = [];
	for (var i = 0; i < bjclMapList.length; i++) {
		var d1 = new Date(bjclMapList[i].xsj);
		var d2 = new Date();
		if (parseInt(d2 - d1) / 1000 / 60 >= 3) {
			templist.push(bjclMapList[i]);
		}
		;// 两个时间相差的分钟数
	}
	for (var i = 0; i < templist.length; i++) {
		bjclMapList.splice($.inArray(templist[i], bjclMapList), 1);
		$("#" + templist[i].id).remove();
	}
}, 10000);


//查询优惠券

function findyhq(obj) {
    var xhrArgs = {
        url : basePath + "ddxpt/findyhq",
        postData : "num=" + obj,
        handleAs : "json"
    };
    return dojo.xhrPost(xhrArgs);
}

function updateYhqIsuse(obj){
    var xhrArgs = {
        url : basePath + "ddxpt/updateYhqIsuse",
        postData : "dispid=" + obj,
        handleAs : "json"
    };
    return dojo.xhrPost(xhrArgs);
}