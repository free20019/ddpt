var LocString = String(window.document.location.href); 
var ljcp ="";
function getQueryStr(str) { 
	var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString), tmp; 
	if (tmp = rs) { 
		return decodeURI(tmp[2]); 
	} 
	return ""; 
} 
ljcp = getQueryStr("cp");
//导出下线车
function daochuxxc(){
	url = basePath + "bjjkx/xxc_daochu", window.open(url);
}

var bjcls="";
var isus="";
var username="";
var realname="";
var host = "192.168.0.102";
var port = 61614;
var clientID = "";
var bjdxclcs = 0;
var destination = "hz_taxi_905_gd";// 报警队列
var isus="";//下发信息的车辆终端
var gzcl="",yjccl="";

var bjclMapList=[];

checklogin();
function checklogin(){
	$.ajax({
	     url : basePath + "login/checklogin",
	     type : 'post',
	     data:{ },
	     async: false,
	     dataType: 'json',
	     success:function(data){
		    	 username = data.username;
		    	 realname = data.realname;
		    	 $("#bjjkx-dlgh").html(username);
		    	 clientID = "bj"+data.username;
		    	 connectMQ(clientID);
	     },
	     error:function(data){
	     }
	 });
}
// mq客户端监听～～～～～～～～～～～
function connectMQ(clientID){
	var meclientID = clientID+"-"+Math.floor(Math.random() * 100000);
//	var meclientID= "8539";
	bjclient = new Messaging.Client(host,Number(port),meclientID);
	bjclient.onMessageArrived = function(e){
//		console.log("接收到的消息"+e.payloadString);

		var xxjson = JSON.parse(e.payloadString);
//		console.log(xxjson);

		if (xxjson.cmd.indexOf('0x0200') > -1) {
			if(gzcl.indexOf(xxjson.vehi_no)<0){
				if (xxjson.cmd == "0x0200_1") {
					$("#bjjkx-zyxx").prepend('<tr><td><a class="bjxx-red" href="javascript:void(0)" data-cp="'+xxjson.vehi_no+'" onclick="bjcldw(this)">'+ xxjson.vehi_no + ' &nbsp;&nbsp;紧急报警&nbsp;&nbsp;'+ formatsj(xxjson.stime) + ' &nbsp;&nbsp;'+ xxjson.longti + ' &nbsp;&nbsp;'+ xxjson.lati + ' &nbsp;&nbsp;</a></td></tr>');
				}else if(xxjson.cmd == "0x0200_2"){
					$("#bjjkx-zyxx").prepend('<tr><td><a class="bjxx-red" href="javascript:void(0)" data-cp="'+xxjson.vehi_no+'" onclick="bjcldw(this)">'+ xxjson.vehi_no + ' &nbsp;&nbsp;超速报警&nbsp;&nbsp;'+ formatsj(xxjson.stime) + ' &nbsp;&nbsp;'+ xxjson.longti + ' &nbsp;&nbsp;'+ xxjson.lati + ' &nbsp;&nbsp;</a></td></tr>');
				}
			}
			if (xxjson.cmd == "0x0200_1") {
				for (var i = 0; i < bjclMapList.length; i++) {
					var ycz = bjclMapList[i];
					
					if(ycz.cp==xxjson.vehi_no){
						if(gzcl.indexOf(xxjson.vehi_no)>=0){
							$("#"+ycz.id).html(xxjson.vehi_no+'-故障');
						}else{
							$("#"+ycz.id).html(xxjson.vehi_no);
						}
						if(yjccl.indexOf(xxjson.isu)>=0){
							$("#"+ycz.id).html(xxjson.vehi_no+'-已解除');
						}
						return;
					}
				}
				var bjclMap={};
				var bjid = createqqid();
				bjclMap.id = bjid;
				bjclMap.cp = xxjson.vehi_no;
				bjclMap.isu = xxjson.isu;
				bjclMap.sj = formatymrsfm(xxjson.stime);
				bjclMapList.push(bjclMap);
				if(gzcl.indexOf(xxjson.vehi_no)>=0){
					$("#bjjkx-bjcl").append('<li id="'+bjid+'" data-value="'+xxjson.isu+'" data-bjsj="'+formatsj(xxjson.stime)+'">'+xxjson.vehi_no+'-故障</li>');
				}else{
					if(yjccl.indexOf(xxjson.isu)>=0){
						$("#bjjkx-bjcl").append('<li id="'+bjid+'" data-value="'+xxjson.isu+'" data-bjsj="'+formatsj(xxjson.stime)+'">'+xxjson.vehi_no+'-已解除</li>');
					}else{
						$("#bjjkx-bjcl").append('<li id="'+bjid+'" data-value="'+xxjson.isu+'" data-bjsj="'+formatsj(xxjson.stime)+'">'+xxjson.vehi_no+'</li>');
					}
				}
				bjcls+=xxjson.vehi_no+";";
				$("#bjjkx-bjcl li").unbind('click').on('click',function() {
					$("#bjjkx-bjcl li").removeAttr("selected");
	                if ($(this).attr('selected')) {
	                    $(this).removeAttr("selected");
	                } else {
	                    $(this).attr("selected", '');
	                }
	            });
				
				$("#bjjkx-bjcl li").unbind('dblclick').on('dblclick',function() {
					bjjkxjsobj.findone($(this).html().split('-')[0]);
	            });
			}
			
//			if (xxjson.cmd == "0x0200_1") {
//				$("#bjjkx-zyxx").prepend('<tr><td><a class="bjxx-red" href="javascript:void(0)" data-cp="'+xxjson.vehi_no+'" onclick="bjcldw(this)">'+ xxjson.vehi_no + ' &nbsp;&nbsp;紧急报警&nbsp;&nbsp;'+ formatsj(xxjson.stime) + ' &nbsp;&nbsp;'+ xxjson.longti + ' &nbsp;&nbsp;'+ xxjson.lati + ' &nbsp;&nbsp;</a></td></tr>');
//				if(bjcls.indexOf(xxjson.vehi_no)<0){
//					//todo
//					
//					if(gzcl.indexOf(xxjson.vehi_no)>=0){
//						$("#bjjkx-bjcl").prepend('<li data-value="'+xxjson.isu+'" data-bjsj="'+formatsj(xxjson.stime)+'">'+xxjson.vehi_no+'-故障</li>');
//					}else{
//						$("#bjjkx-zyxx").prepend('<tr><td><a class="bjxx-red" href="javascript:void(0)" data-cp="'+xxjson.vehi_no+'" onclick="bjcldw(this)">'+ xxjson.vehi_no + ' &nbsp;&nbsp;紧急报警&nbsp;&nbsp;'+ formatsj(xxjson.stime) + ' &nbsp;&nbsp;'+ xxjson.longti + ' &nbsp;&nbsp;'+ xxjson.lati + ' &nbsp;&nbsp;</a></td></tr>');
//						$("#bjjkx-bjcl").prepend('<li data-value="'+xxjson.isu+'" data-bjsj="'+formatsj(xxjson.stime)+'">'+xxjson.vehi_no+'</li>');
//					}
//					bjcls+=xxjson.vehi_no+";";
//					$("#bjjkx-bjcl li").unbind('click').on('click',function() {
//						$("#bjjkx-bjcl li").removeAttr("selected");
//                        if ($(this).attr('selected')) {
//                            $(this).removeAttr("selected");
//                        } else {
//                            $(this).attr("selected", '');
//                        }
//                    });
//					
//					$("#bjjkx-bjcl li").unbind('dblclick').on('dblclick',function() {
//						bjjkxjsobj.findone($(this).html());
//                    });
//				}else{
//					if(gzcl.indexOf(xxjson.vehi_no)<0){
//						$("#bjjkx-zyxx").prepend('<tr><td><a class="bjxx-red" href="javascript:void(0)" data-cp="'+xxjson.vehi_no+'" onclick="bjcldw(this)">'+ xxjson.vehi_no + ' &nbsp;&nbsp;紧急报警&nbsp;&nbsp;'+ formatsj(xxjson.stime) + ' &nbsp;&nbsp;'+ xxjson.longti + ' &nbsp;&nbsp;'+ xxjson.lati + ' &nbsp;&nbsp;</a></td></tr>');
//					}
//				}
//			}
			if($("#bjjkx-zyxx tr").length>50){
				$($("#bjjkx-zyxx tr")[50]).remove();
			}
		} else if (xxjson.cmd.indexOf('0x8300') > -1) {
			
			var msg = "下发成功";
			if (isus.indexOf(xxjson.isu) > -1) {
				if(xxjson.result==0){
					layer.msg('消息下发成功！');
					msg = "下发成功";
				}else{
					layer.msg('消息下发失败！');
					msg = "下发失败";
				}
			} 
			isus="";
			$("#bjjkx-dxx").prepend('<tr><td><a class="bjxx-red" href="javascript:void(0)" data-cp="'+xxjson.vehi_no+'" onclick="bjcldw(this)">'+ xxjson.vehi_no + ' &nbsp;&nbsp;'+msg+'&nbsp;&nbsp;'+ setformat1(new Date()) + ' &nbsp;&nbsp;</a></td></tr>');
			if($("#bjjkx-dxx tr").length>50){
				$($("#bjjkx-dxx tr")[50]).remove();
			}
		}
	};
	bjclient.onConnectionLost = function(e) {
		$("#bjjkx-txzt").html("断开连接");
		$("#bjjkx-txzt").css('color', 'red');
		if(bjtcindex==2){
			bjdxclcs++;
			connectMQ(clientID);
		}
	};
	bjclient.connect({
		onSuccess : function() {
			bjclient.subscribe(destination);
			layer.msg("连接服务器成功！");
			$("#bjjkx-txzt").html("已连接");
			bjtcindex=2;
			$("#bjjkx-txzt").css('color', '#37f38e');
			console.log("消息队列连接成功");
		},
		onFailure : function() {
			console.log("消息队列连接失败");
			$("#bjjkx-txzt").html("连接失败");
			$("#bjjkx-txzt").css('color', 'red');
			bjdxclcs++;
			if (bjdxclcs > 5) {
				layer.msg("连接服务器失败，请检查网络！");
			} else{
				connectMQ(clientID);
			}
		}
	});
}
//查询区域

function findcompname(obj) {
	var xhrArgs = {
			url : basePath + "bjjkx/findcompname",
			postData : "cp=" + obj,
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

function formatsj(obj){
//	obj = "20"+obj;
	return obj.substring(0,4)+"-"+obj.substring(4,6)+"-"+obj.substring(6,8)
		+" "+obj.substring(8,10)+":"+obj.substring(10,12)+":"+obj.substring(12,14);
}
function formatymrsfm(obj){
//	obj = "20"+obj;
	return obj.substring(0,4)+"-"+obj.substring(4,6)+"-"+obj.substring(6,8)
		+" "+obj.substring(8,10)+":"+obj.substring(10,12)+":"+obj.substring(12,14);
}
//解除报警
var bjisu="";
function jcbj(obj){
	bjisu = obj.isu;
	var xhrArgs = {
		url : basePath + "bjjkx/jcbj",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function bjcldw(obj){
	bjjkxjsobj.findone($(obj).data('cp'));
}
function bjcl(obj){
	var xhrArgs = {
		url : basePath + "bjjkx/bjcl",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function bjcledit(obj){
	var xhrArgs = {
		url : basePath + "bjjkx/bjcledit",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}
function findbjclitem(obj){
	var xhrArgs = {
		url : basePath + "bjjkx/findbjclitem",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function getbjtb(obj) {
	// 空车，重车，离线，任务车
	var wjj="car";
	if(obj.isxh=="1"){
		wjj="xhcar";
	}
	if(bjcls.indexOf(obj.vehino)>-1){
		if (obj.heading==""||obj.heading==null||obj.heading == 0) {
			return "resources/images/"+wjj+"/b1.png";
		} else if (obj.heading == 90) {
			return "resources/images/"+wjj+"/b2.png";
		} else if (obj.heading == 180) {
			return "resources/images/"+wjj+"/b3.png";
		} else if (obj.heading == 270) {
			return "resources/images/"+wjj+"/b4.png";
		} else if (obj.heading > 0 && obj.heading < 90) {
			return "resources/images/"+wjj+"/b5.png";
		} else if (obj.heading > 90 && obj.heading < 180) {
			return "resources/images/"+wjj+"/b6.png";
		} else if (obj.heading > 180 && obj.heading < 270) {
			return "resources/images/"+wjj+"/b7.png";
		} else if (obj.heading > 270 && obj.heading < 360) {
			return "resources/images/"+wjj+"/b8.png";
		}
	}else{
		if (obj.onoffstate == "1") {
			if (obj.carStatus == 0) {// 空车
				if (obj.heading==""||obj.heading==null||obj.heading == 0) {
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
			} else {// 重车
				if (obj.heading==""||obj.heading==null||obj.heading == 0) {
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
			}
		} else { // 离线
			if (obj.heading==""||obj.heading==null||obj.heading == 0) {
				return "resources/images/"+wjj+"/l1.png";
			} else if (obj.heading == 90) {
				return "resources/images/"+wjj+"/l2.png";
			} else if (obj.heading == 180) {
				return "resources/images/"+wjj+"/l3.png";
			} else if (obj.heading == 270) {
				return "resources/images/"+wjj+"/l4.png";
			} else if (obj.heading > 0 && obj.heading < 90) {
				return "resources/images/"+wjj+"/l5.png";
			} else if (obj.heading > 90 && obj.heading < 180) {
				return "resources/images/"+wjj+"/l6.png";
			} else if (obj.heading > 180 && obj.heading < 270) {
				return "resources/images/"+wjj+"/l7.png";
			} else if (obj.heading > 270 && obj.heading < 360) {
				return "resources/images/"+wjj+"/l8.png";
			}
		}
	}
}

function getbjtb2(obj) {
	var wjj="car";
	if(obj.ISXH=="1"){
		wjj="xhcar";
	}
	// 空车，重车，离线，任务车
	if(bjcls.indexOf(obj.VEHI_NO)>-1){
		if (obj.ANGLE==""||obj.ANGLE==null||obj.ANGLE == 0) {
			return "resources/images/"+wjj+"/b1.png";
		} else if (obj.ANGLE == 90) {
			return "resources/images/"+wjj+"/b2.png";
		} else if (obj.ANGLE == 180) {
			return "resources/images/"+wjj+"/b3.png";
		} else if (obj.ANGLE == 270) {
			return "resources/images/"+wjj+"/b4.png";
		} else if (obj.ANGLE > 0 && obj.ANGLE < 90) {
			return "resources/images/"+wjj+"/b5.png";
		} else if (obj.ANGLE > 90 && obj.ANGLE < 180) {
			return "resources/images/"+wjj+"/b6.png";	
		} else if (obj.ANGLE > 180 && obj.ANGLE < 270) {
			return "resources/images/"+wjj+"/b7.png";
		} else if (obj.ANGLE > 270 && obj.ANGLE < 360) {
			return "resources/images/"+wjj+"/b8.png";
		}
	}else{
		if (obj.onoffstate == "1") {
			if (obj.CARSTATE == 0) {// 空车
				if (obj.ANGLE==""||obj.ANGLE==null||obj.ANGLE == 0) {
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
				if (obj.ANGLE==""||obj.ANGLE==null||obj.ANGLE == 0) {
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
			if (obj.ANGLE==""||obj.ANGLE==null||obj.ANGLE == 0) {
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


function addarea(obj){
	var xhrArgs = {
		url : basePath + "bjjkx/addarea",
		postData : "postData=" + encodeURI(encodeURI(JSON.stringify(obj))),
		handleAs : "json"
	};
	return dojo.xhrPost(xhrArgs);
}

function delarea(obj){
	var sqyindex = layer.confirm('确定删除该区域？', {
		  btn: ['确定','取消'] //按钮
		}, function(){
			dojo.xhrPost({
				url : basePath + "bjjkx/delarea",
				postData :{"areaid":obj},
				handleAs : "json",
				Origin : self.location.origin,
				preventCache : true,
				withCredentials : true,
				load : function(data) {
					layer.msg(data.msg);
					layer.close(sqyindex);
				},
				error : function(error) {
					console.log(error);
				}
			});
		}, function(){
		});
}

setInterval(function(){
	var templist = [];
	for (var i = 0; i < bjclMapList.length; i++) {
		var d1 = new Date(bjclMapList[i].sj);
		var d2 = new Date();
		if(parseInt(d2 - d1) / 1000 / 60>=3){
			templist.push(bjclMapList[i]);
		};//两个时间相差的分钟数
	}
	for (var i = 0; i < templist.length; i++) {
		bjclMapList.splice($.inArray(templist[i], bjclMapList), 1);
		
		$("#"+templist[i].id).remove();
	}
 },10000);

//报警解除车辆
//var bjjclist=[];


function jcbjresult(obj){
	for (var i = 0; i < bjclMapList.length; i++) {
		var ycz = bjclMapList[i];
		if(ycz.isu==obj){
			bjclMapList.splice($.inArray(ycz, bjclMapList), 1);
			$("#"+ycz.id).remove();
			
//			var bjclMap={};
//			bjclMap.isu = obj;
//			bjclMap.sj = formatymrsfm(xxjson.stime);
			
			break
		}
	}
}
