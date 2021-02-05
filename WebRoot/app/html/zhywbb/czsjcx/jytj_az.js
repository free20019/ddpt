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
		var loadindex;
		var yyazGrid = null, store = null;
		sjdid=5;
		var columns = {
			dojoId: {label: '序号'},
			DAY: {label: '日期'},
			SJD: {label: '时间段'},
			QY: {label: '区域'},
			RYYCS: {label: '总营运次数(次)'},
			CLZS: {label: '车辆总数(辆)'},
			RYYCL: {label: '营运车辆数(辆)'},
			RZLC: {label: '总行驶里程(公里)'},
			RZKLC: {label: '载客行驶里程(公里)'},
			RKSLC: {label: '空驶里程(公里)'},
			RYSJE: {label: '总营收金额(元)'},
			DHSJ: {label: '等候时间(分钟)'},
			RYYSC: {label: '营运时长(小时)'},
			ZZCS: {label: '周转次数(次/辆)'},
			PJYS: {label: '平均营收(元/辆)'},
			PJXSSD: {label: '平均行驶速度(公里/小时)'},
			PJYYSC: {label: '平均营运时长(小时/辆)'},
			PJDHSJ: {label: '平均等候时间(分/辆)'},
			SLL: {label: '上路率'}
		};

		var xhrArgsTabel = {
			url : basePath + "zhyw/queryztj",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
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
				yyazGrid.set('collection', store);
			},
			error : function(error) {
				layer.close(loadindex);
				console.log(error);
			}
		};
		
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				this.get();
			},
			get:function(){
				loadindex = layer.load(1);
				var postData = {};
				postData.stime=$("#yyaz-stime").val();
				postData.etime=$("#yyaz-etime").val();
				postData.qy=$("#yyaz-quyu-comboBox").find('input').val();
				postData.sjd=sjdid;
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				var _self = this;
				if (yyazGrid) { yyazGrid = null; dojo.empty('yyazTable') }
				yyazGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'yyazTable');
				addEventComboBox('#s2Panel');
				
				$("#yyaz-etime").val(setformat3(new Date(new Date().getTime()-1000*24*3600)));

				$("#yyaz-stime").val(setformat3(new Date(new Date().getTime()-7*1000*24*3600)));

				$("#yyaz-stime").click(function () {
						WdatePicker({
							el: 'yyaz-stime',
							onpicked: function () {
								///console.log(this.value);

								$("#yyaz-etime").val(setformat3(new Date(new Date(this.value).getTime()+6*1000*24*3600)));
							},
							dateFmt: 'yyyy-MM-dd'
						});
					});


				/*早高峰*/
				query('#yyaz-zgf').on('click', function () {
					sjdid=1;
					_self.get();
				});
				/*晚高峰*/
				query('#yyaz-wgf').on('click', function () {
					sjdid=2;
					_self.get();
				});
				/*全天*/
				query('#yyaz-qt').on('click', function () {
					sjdid=5;
					_self.get();
				});
				/*晚间*/
				query('#yyaz-yj').on('click', function () {
					sjdid=4;
					_self.get();
				});
				/*白天*/
				query('#yyaz-bt').on('click', function () {
					sjdid=3;
					_self.get();
				});
				/*凌晨*/
				query('#yyaz-lc').on('click', function () {
					sjdid=6;
					_self.get();
				});
				
				//导出
				query('#yyaz-dc').on('click', function () {
					var postData = {};
					postData.stime=$("#yyaz-stime").val();
				postData.etime=$("#yyaz-etime").val();
				postData.qy=$("#yyaz-quyu-comboBox").find('input').val();
				postData.sjd=sjdid;
					url = basePath + "zhyw/ztj_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		});
	});