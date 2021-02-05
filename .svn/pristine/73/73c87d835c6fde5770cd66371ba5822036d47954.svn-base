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
		var gstjGrid = null, store = null;
		var queryCondition={},settime=null;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			QY: {label: '区域'},
			FGS: {label: '公司'},
			RYYCS: {label: '总营运次数(次)'},
			RYYCL: {label: '营运车辆数(辆)'},
			RYSJE: {label: '总营收金额(元)'},
			RZKLC: {label: '载客行驶里程(公里)'},
			RKSLC: {label: '空驶里程(公里)'},
			RZLC: {label: '总行驶里程(公里)'},
			RYYSC: {label: '营运时长(小时)'},
			DHSJ: {label: '等候时间(分钟)'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/gstj",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				if(data==null){
					layer.alert("链接超时！");
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
				gstjGrid.set('collection', store);
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
				postData.stime=$("#gstj-startTime").val();
				postData.etime=$("#gstj-endTime").val();
				postData.qy=$("#gstj-quyu-comboBox").find('input').val();  
				postData.gs=$("#gstj-company-comboBox").find('input').val();
				loadindex = layer.load(1);
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				
				var _self = this;
				if (gstjGrid) { gstjGrid = null; dojo.empty('gstjTabel') }
				gstjGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'gstjTabel');
				$("#gstj-startTime").val(setformat3(new Date()));
				$("#gstj-endTime").val(setformat3(new Date()));
				
				addEventComboBox('#gstjPanel');

				query('#gstj-startTime').on('focus', function () {
					WdatePicker({
						dateFmt: STATEDATE
					});
				});
				query('#gstj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				
				//公司
				findgs().then(function(data){
					$("#gstj-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#gstj-company-comboBox").find('.iFList').append(gss);
					}
					$('#gstj-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#gstj-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
					});
					$("#gstj-company-comboBox").find('input').on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#gstj-company-comboBox").find('input').val()).then(function(data2){
								$("#gstj-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#gstj-company-comboBox").find('.iFList').append(gss);
								}
								$('#gstj-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#gstj-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
								});
							});
						}, 1200)
					});
				});
				query('#gstjQuery').on('click', function () {
					var stime= $("#gstj-startTime").val();
					var etime= $("#gstj-endTime").val();
					if(stime.substring(0,7)!=etime.substring(0,7)){
						$("#czjg").html("不支持跨月查询！");
						dijit.byId('qd_dialog').show();
					}else{
						var postData = {};
						postData.stime=stime;
						postData.etime=etime;
						postData.qy=$("#gstj-quyu-comboBox").find('input').val();  
						postData.gs=$("#gstj-company-comboBox").find('input').val();
						loadindex = layer.load(1);
						dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
					}
				});
				//导出
				query('#gstjDaochu').on('click', function () {
					if($("#gstj-startTime").val().substring(0,7)!=$("#gstj-endTime").val().substring(0,7)){
						$("#czjg").html("不支持跨月查询！");
						dijit.byId('qd_dialog').show();
					}else{
						var postData = {};
						postData.stime=$("#gstj-startTime").val();
						postData.etime=$("#gstj-endTime").val();
						postData.qy=$("#gstj-quyu-comboBox").find('input').val();   
						postData.gs=$("#gstj-company-comboBox").find('input').val();	 
						url = basePath + "zhyw/gstj_daochu?postData="
	             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
					}
				});
				
				
				
			}
		})
	});