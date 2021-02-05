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
		var gsytjGrid = null, store = null;
		var queryCondition={},settime=null;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			DAY: {label: '日期'},
			FGS: {label: '公司'},
			RYYCS: {label: '总营运次数(次)'},
//			CLZS: {label: '车辆总数(辆)'},
			RYYCL: {label: '营运车辆数(辆)'},
			RYSJE: {label: '总营收金额(元)'},
			RZKLC: {label: '载客行驶里程(公里)'},
			RKSLC: {label: '空驶里程(公里)'},
			RZLC: {label: '总行驶里程(公里)'},
			RYYSC: {label: '营运时长(小时)'},
			DHSJ: {label: '等候时间(分钟)'}
//			,
//			ZZCS: {label: '周转次数(次/辆)'},
//			PJYS: {label: '平均营收(元/辆)'},
//			PJXSSD: {label: '平均行驶速度(公里/小时)'},
//			PJYYSC: {label: '平均营运时长(小时/辆)'},
//			PJDHSJ: {label: '平均等候时间(分/辆)'},
//			SLL: {label: '上路率'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/gsytj",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
//				console.log(data);
				if(data==null){
					alert("链接超时！");
				}
				layer.close(loadindex);
				unloading();
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
				gsytjGrid.set('collection', store);
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
			},
			initToolBar:function(){
				var _self = this;
				if (gsytjGrid) { gsytjGrid = null; dojo.empty('gsytjTabel') }
				gsytjGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'gsytjTabel');
				$("#gsytj-yf").val(setformat5(new Date()));
				
				addEventComboBox('#gsytjPanel');

				query('#gsytj-yf').on('focus', function () {
					WdatePicker({
						dateFmt: STATEYM
					});
				});
				//公司
				findgs().then(function(data){
					$("#gsytj-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#gsytj-company-comboBox").find('.iFList').append(gss);
					}
					$('#gsytj-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#gsytj-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
					});
					$("#gsytj-company-comboBox").find('input').on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#gsytj-company-comboBox").find('input').val()).then(function(data2){
								$("#gsytj-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#gsytj-company-comboBox").find('.iFList').append(gss);
								}
								$('#gsytj-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#gsytj-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
								});
							});
						}, 1200)
					});
				});
				query('#gsytjQuery').on('click', function () {
					if($("#gsytj-company-comboBox").find('input').val()==""){
						$("#czjg").html("请选择公司！");
						dijit.byId('qd_dialog').show();
					}else{
						var postData = {};
						postData.yf=$("#gsytj-yf").val();
						postData.gs=$("#gsytj-company-comboBox").find('input').val();
						loadindex = layer.load(1);
						dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
					}
				});
				//导出
				query('#gsytjDaochu').on('click', function () {
					if($("#gsytj-company-comboBox").find('input').val()==""){
						$("#czjg").html("请选择公司！");
						dijit.byId('qd_dialog').show();
					}else{
						var postData = {};
						postData.yf=$("#gsytj-yf").val();
						postData.gs=$("#gsytj-company-comboBox").find('input').val();	 
						url = basePath + "zhyw/gsytj_daochu?postData="
	             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
					}
				});
			}
		})
	});