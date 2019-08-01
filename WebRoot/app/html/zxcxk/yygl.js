define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination1", "dgrid/Selection",
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
		var yyglGrid = null, store = null;

		var columns = {
			checkbox: {label: '选择', renderCell: function (item) {
				var div = dc.create('div', {});
				dc.place(dc.create('input', {type: 'checkbox', name: 'tableCheckBox', id: item.DISP_ID}), div);
				return div;
			}},
			dojoId: {label: '序号'},
			DISP_ID: {label: '业务编号'},
			YC_TIME: {label: '预约时间', formatter:util.formatYYYYMMDDHHMISS},
			CUST_NAME: {label: '客户姓名'},
			CUST_TEL: {label: '联系电话'},
			ADDRESS: {label: '详细地址'},
			DISP_USER: {label: '调度员'},
			VEHI_NO: {label: '所派车辆'},
			DISP_STATE: {label: '调度状态'},
			DISP_TIME: {label: '调度时间', formatter:util.formatYYYYMMDDHHMISS},
			DISP_TYPE: {label: '约车类型'},
			NOTE: {label: '附加信息'},
			DEST_ADDRESS: {label: '目的地址'},
			GSMC: {label: '公司'},
			ZDLX: {label: '终端类型'},
			ISCOMPL: {label: '是否投诉'},
			DISP_TIME: {label: '下单时间', formatter:util.formatYYYYMMDDHHMISS},
			AUTOOUTPHONE: {label: '是否自动外拨', formatter:util.formatSFWB},
			OUTPHONE: {label: '外拨号码'},
			CALL_STATE: {label: '外呼状态', formatter:util.formatTZZT}
		};
		var xhrArgsTabel = {
				url : basePath + "kb/queryyy",
				postData :{},
				handleAs : "json",
				Origin : self.location.origin,
				preventCache : true,
				withCredentials : true,
				load : function(data) {
					unloading();
					for (var i = 0; i < data.length; i++) {
						data[i] = dojo.mixin({
							dojoId : i + 1
						}, data[i]);
					}
					store = new Memory({
						data : {
							identifier : 'dojoId',
							label : 'dojoId',
							items : data
						}
					});
					yyglGrid.totalCount = data.length;
					yyglGrid.set('collection', store);
					$("#yyts").html(data.length);
				},
				error : function(error) {
					console.log(error);
				}
			};
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
				var _self = this;
				if (yyglGrid) { yyglGrid = null; dojo.empty('yyglTabel') }
				yyglGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "yyglTabel");
				
				$("#yystime").val(setformat3(new Date()));
				$("#yyetime").val(setformat3(new Date()));
				
				query('#yycxbtn').on('click', function () {
					var postData = {};
					postData.cxgjz=$("#yycxgjz").val();
					postData.stime=$("#yystime").val();
					postData.etime=$("#yyetime").val();
					loading('#yyglTabel');
					dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
				});
				
				query('#yyqxbtn').on('click', function () {
					var xgids="";
					$('input[name="tableCheckBox"]:checked').each(function(){ 
						xgids+="'"+this.id+"',";
           		 	}); 
					if(xgids==""){
							layer.msg("请选择一条记录！");
						return;
					}
					layer.confirm('取消该预约？', {
						  btn: ['确定','取消'] //按钮
						}, function(){
							dojo.xhrPost({
								postData: 'postData={"id" :"'+xgids+'"}',
								url: encodeURI('kb/qxyy'),
								handleAs : "json",
								preventCache:true,
								withCredentials :  true,
								load : function(data) {
									layer.msg(data.msg);
									dojo.xhrPost(xhrArgsTabel);
								}
							});
						}, function(){
						});
				});
				
				//导出
				query('#yycxdaochubtn').on('click', function () {
					var postData = {};
					postData.cxgjz=$("#yycxgjz").val();
					postData.stime=$("#yystime").val();
					postData.etime=$("#yyetime").val();
					
					url = basePath + "kb/queryyy_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		})
	});