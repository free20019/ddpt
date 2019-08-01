var infoWindow = new AMap.InfoWindow({
	offset : new AMap.Pixel(-3, 0)
});
define([ "dijit/Dialog", "dijit/form/Button", "dijit/form/Select",
	"dgrid/OnDemandGrid", 'dgrid/Selector', "dijit/form/TextBox",
	"app/Pagination", "dgrid/Selection", "dgrid/Keyboard",
	"dgrid/extensions/ColumnResizer", "dstore/Memory",
	"dijit/form/NumberTextBox", "dgrid/extensions/DijitRegistry",
	"dijit/registry", "dojo/dom-style", "dojo/_base/declare",
	"dojo/dom-construct", "dojo/on", "dojo/query", 'dojo/dom-class',
	"app/util" ], function(Dialog, Button, Select, Grid, Selector, TextBox,
						   Pagination, Selection, Keyboard, ColumnResizer, Memory, NumberTextBox,
						   DijitRegistry, registry, domStyle, declare, dc, on, query, domClass,
						   util) {
	return declare(null, {
		constructor : function() {
			this.initToolBar();
		},
		initToolBar : function() {
			map_lxt = new AMap.Map('lxt-mapBox', {
				animateEnable:false,
				jogEnable:false,
				view: new AMap.View2D({
					center: new AMap.LngLat(120.153576,30.287459),
					zoom: 10
				})

			});
			findodlxt();
		}
	});
});
$("#lxt-btnDate").click(function(){
	findallmar1();
});
function findodlxt(){
	dojo.xhrGet({
		url : basePath + "back/findssjk",
		handleAs : "json",
		load : function(data) {
			var zs=0,zc=0,kc=0;
			for(var i=0; i<data.length; i++){
				zs ++;
				if(data[i].STATE=='1'){
					zc++;
				}else{
					kc ++;
				}
			}
			$("#lxt-mapShowList").append("<li class='iconItem'>总数："+zs+"</li>");
			$("#lxt-mapShowList").append("<li class='iconItem'>重车："+zc+"</li>");
			$("#lxt-mapShowList").append("<li class='iconItem'>空车："+kc+"</li>");
			for(var i=0; i<data.length; i++){
				$("#lxt-mapShowList").append("<li class='iconItem findmarker' bicycleno = '"+data[i].VEHI_NO+"'>"+data[i].VEHI_NO+"</li>")
			}
			jh(data);
			findallmar();
		}
	});
}
function jh(vehilist) {
	cluster = null;
	markers = [];
	for (var i = 0; i < vehilist.length; i += 1) {
		var icon = "";
		if (vehilist[i].STATE == '1') {
			icon = "resources/images/3.png";
		} else if (vehilist[i].STATE == '0') {
			icon = "resources/images/2.png";
		}
		var marker = new AMap.Marker({
			position : [ vehilist[i].LONGI, vehilist[i].LATI ],
			icon : icon,
			offset : new AMap.Pixel(-15, -15)
		});
		marker.vehicle = vehilist[i];
//		marker.content = '所属平台：' + vehilist[i].compname + '<br>' +
//						 '车辆编号：' + vehilist[i].vehino + '<br>' +
//						 'GPS时间：'+ vehilist[i].dateTime + '<br>' +
//						 '出租状态：'+ (vehilist[i].cartype=='0'?'已租车':'未租车') + '<br>' +
//						 '报警状态：'+ (vehilist[i].carStatus=='0'?'正常':'报警') + '<br>';
//		marker.on('mouseover', markerClick);
//		marker.on('click', markerClick);
		marker.on('mouseout', markerMouseout);
		AMap.event.addListener(marker,"mouseover",function(e){
			  var obj = this.vehicle;
			  	var txt = '所属公司：' + obj.COMP_NAME + '<br>' +
				 '车牌：' + obj.VEHI_NO + '<br>' +
				 '终端：'+ obj.MDT_NO + '<br>' +
				 '终端类型：'+ obj.MDT_SUB_TYPE + '<br>' +
				 '时间：'+ setformat1(new Date(obj.STIME)) + '<br>';
			  	infoWindow.setContent(txt);
			  	infoWindow.open(map_lxt,new AMap.LngLat(obj.LONGI,obj.LATI));
			});
		AMap.event.addListener(marker,"click",function(e){
			  var obj = this.vehicle;
				var txt = '所属公司：' + obj.COMP_NAME + '<br>' +
				 '车牌：' + obj.VEHI_NO + '<br>' +
				 '终端：'+ obj.MDT_NO + '<br>' +
				 '终端类型：'+ obj.MDT_SUB_TYPE + '<br>' +
				 '时间：'+ setformat1(new Date(obj.STIME)) + '<br>';
			  	infoWindow.setContent(txt);
			  	infoWindow.open(map_lxt,new AMap.LngLat(obj.LONGI,obj.LATI));
			});
		// marker.emit('mouseover', {target: marker});
		markers.push(marker);
	}
	// 自定义图标
	var sts = [ {
		url : "http://a.amap.com/jsapi_demos/static/images/blue.png",
		size : new AMap.Size(32, 32),
		offset : new AMap.Pixel(-16, -16)
	}, {
		url : "http://a.amap.com/jsapi_demos/static/images/green.png",
		size : new AMap.Size(32, 32),
		offset : new AMap.Pixel(-16, -16)
	}, {
		url : "http://a.amap.com/jsapi_demos/static/images/orange.png",
		size : new AMap.Size(36, 36),
		offset : new AMap.Pixel(-18, -18)
	}, {
		url : "http://a.amap.com/jsapi_demos/static/images/red.png",
		size : new AMap.Size(48, 48),
		offset : new AMap.Pixel(-24, -24)
	}, {
		url : "http://a.amap.com/jsapi_demos/static/images/darkRed.png",
		size : new AMap.Size(48, 48),
		offset : new AMap.Pixel(-24, -24)
	} ];
	cluster = new AMap.MarkerClusterer(map_lxt, markers, {
		styles : sts,
		minClusterSize : 8,
		maxZoom : 17,
		gridSize : 80
	});
}
function markerMouseout() {
	javascript: infoWindow.close();
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
function findallmar(){
	$(".findmarker").click(function(){
		var bicycleno = $(this).attr("bicycleno");
		map_lxt.setZoom(18);
		var allmar = cluster.getMarkers();
		for(var i=0; i<allmar.length;i++){
			if(allmar[i].vehicle.VEHI_NO==bicycleno){
				map_lxt.setZoomAndCenter(18, [allmar[i].vehicle.LONGI, allmar[i].vehicle.LATI]);
				AMap.event.trigger(allmar[i],'click');
			}
		}
	});
}
function findallmar1(){
	a=0;
	var bicycleno = $("#lxt-date").val();
	map_lxt.setZoom(18);
	var allmar = cluster.getMarkers();
	for(var i=0; i<allmar.length;i++){
		if(allmar[i].vehicle.VEHI_NO==bicycleno){
			a = 1;
			map_lxt.setZoomAndCenter(18, [allmar[i].vehicle.LONGI, allmar[i].vehicle.LATI]);
			AMap.event.trigger(allmar[i],'click');
		}
	}
	if(a == 0){
		alert("暂无此车");
	}
	a = 0;
}