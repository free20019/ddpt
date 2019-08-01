define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination", "dgrid/Selection",
		"dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
		"dojo/store/Memory","cbtree/model/TreeStoreModel",
		"dstore/Memory","dijit/form/NumberTextBox",
		"dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
		"dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
		"cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ],
	function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
			 SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
			 Pagination, Selection, Keyboard, ColumnResizer,
			 Memory2,TreeStoreModel,
			 Memory,NumberTextBox, DijitRegistry, registry, domStyle,
			 declare, dc, on,ObjectStoreModel, Tree,
			 ForestStoreModel, ItemFileWriteStore, query, util) {
		var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer]);
		var gspjGrid = null, store = null;
		var queryCondition={},settime=null;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			QY: {label: '区域'},
			FGS: {label: '公司'},
			RYYCS: {label: '总营运次数(次)'},
			RYYCL: {label: '营运车辆数(辆)'},
			ZZCS: {label: '周转次数(次/辆)'},
			PJYYSC: {label: '平均营运时长(小时/辆)'},
			PJDHSJ: {label: '平均等候时间(分/辆)'},
			PJYS: {label: '平均营收(元/辆)'},
			PJZLC: {label: '平均总里程(公里)'},
			PJZKLC: {label: '平均实载里程(公里)'},
			PJKSLC: {label: '平均空驶里程(公里)'},
			PJXSSD: {label: '平均行驶速度(公里/小时)'},
//			SLL: {label: '上路率'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/gspj",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				if(data==null){
					alert("链接超时！");
				}
				layer.close(loadindex);
				
				for (var i = 0; i < data.data.length; i++) {
					data.data[i] = dojo.mixin({
						dojoId : i + 1
					}, data.data[i]);
				}
				store = new Memory({
					data : {
						identifier : 'dojoId',
						label : 'dojoId',
						items : data.data
					}
				});
				gspjGrid.set('collection', store);
			},
			error : function(error) {
				layer.close(loadindex);
				console.log(error);
			}
		};
		
		var pageii;
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				var postData = {};
				postData.stime=$("#gspj-startTime").val();
				postData.etime=$("#gspj-endTime").val();
				postData.qy=$("#gspj-quyu-comboBox").find('input').val();  
				postData.gs=$("#gspj-company-comboBox").find('input').val();
				loadindex = layer.load(1);
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				
				var _self = this;
				if (gspjGrid) { gspjGrid = null; dojo.empty('gspjTabel') }
				gspjGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'gspjTabel');
				$("#gspj-startTime").val(setformat3(new Date()));
				$("#gspj-endTime").val(setformat3(new Date()));
				
				addEventComboBox('#gspjPanel');

				query('#gspj-startTime').on('focus', function () {
					WdatePicker({
						dateFmt: STATEDATE
					});
				});
				query('#gspj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				
				//公司
				findgs().then(function(data){
					$("#gspj-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#gspj-company-comboBox").find('.iFList').append(gss);
					}
					$('#gspj-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#gspj-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
					});
					$("#gspj-company-comboBox").find('input').on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#gspj-company-comboBox").find('input').val()).then(function(data2){
								$("#gspj-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#gspj-company-comboBox").find('.iFList').append(gss);
								}
								$('#gspj-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#gspj-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
								});
							});
						}, 1200)
					});
				});
				query('#gspjQuery').on('click', function () {
					var stime= $("#gspj-startTime").val();
					var etime= $("#gspj-endTime").val();
					if(stime.substring(0,7)!=etime.substring(0,7)){
						$("#czjg").html("不支持跨月查询！");
						dijit.byId('qd_dialog').show();
					}else{
						var postData = {};
						postData.stime=stime;
						postData.etime=etime;
						postData.qy=$("#gspj-quyu-comboBox").find('input').val();  
						postData.gs=$("#gspj-company-comboBox").find('input').val();
						loadindex = layer.load(1);
						dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
					}
				});
				//导出
				query('#gspjDaochu').on('click', function () {
					if($("#gspj-startTime").val().substring(0,7)!=$("#gspj-endTime").val().substring(0,7)){
						$("#czjg").html("不支持跨月查询！");
						dijit.byId('qd_dialog').show();
					}else{
						var postData = {};
						postData.stime=$("#gspj-startTime").val();
						postData.etime=$("#gspj-endTime").val();
						postData.qy=$("#gspj-quyu-comboBox").find('input').val();   
						postData.gs=$("#gspj-company-comboBox").find('input').val();	 
						url = basePath + "zhyw/gspj_daochu?postData="
	             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
					}
				});
				
				
				
			}
		})
	});