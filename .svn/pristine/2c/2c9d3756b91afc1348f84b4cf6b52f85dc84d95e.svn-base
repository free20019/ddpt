define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination1", "dgrid/Selection",
		"dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
		"dojo/store/Memory","cbtree/model/TreeStoreModel",
		"dstore/Memory","dijit/form/NumberTextBox",
		"dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
		'dstore/Trackable', 'dgrid/Selector',
		"dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
		"cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ],
	function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
			 SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
			 Pagination, Selection, Keyboard, ColumnResizer,
			 Memory2,TreeStoreModel,
			 Memory,NumberTextBox, DijitRegistry, registry, domStyle,
			 Trackable, Selector,
			 declare, dc, on,ObjectStoreModel, Tree,
			 ForestStoreModel, ItemFileWriteStore, query, util) {
		var CustomGrid = declare([Grid, Keyboard, Selection, DijitRegistry, Editor, ColumnResizer, Selector]);
		var statistics4Grid = null, store = null;


		var columns = {};
		var xhrArgsTabel = {
			url : basePath + "kb/querycl",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				console.log(data);
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
				statistics4Grid.totalCount = data.count;
				statistics4Grid.set('collection', store);
				statistics4Grid.pagination.refresh(data.data.length);
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
				query('#statistics4-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#statistics4-endTime').trigger('focus')
						},
						dateFmt: STATEDATE});
				});
				query('#statistics4-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});

				if (statistics4Grid) { statistics4Grid = null; dojo.empty('statistics4Table') }
				statistics4Grid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'statistics4Table');

				/*统计公司*/
				query('#statistics4-tjgs').on('click', function () {
					columns = {
						dojoId: {label: '序号'},
						RQ: {label: '日期'},
						ZYYCS: {label: '总营运次数'},
						CYYYCLS: {label: '参与营运车辆数'},
						SLL: {label: '上路率'},
						PJZZCS: {label: '平均周转次数'},
						PJYSSJ: {label: '平均营收时间'},
						PJDHSJ: {label: '平均等候时间'},
						PJYSQK: {label: '平均营收情况'},
						ZLC: {label: '总里程'},
						SZLC: {label: '实载里程'},
						KSLC: {label: '空驶里程'}
					};
					statistics4Grid.set('columns', columns);
					$('#statistics4Table').show();
				});
				/*公司平均*/
				query('#statistics4-gspj').on('click', function () {
					columns = {
						dojoId: {label: '序号'},
						GS: {label: '公司'},
						YYCS: {label: '营运次数'},
						YYCLS: {label: '营运车辆数'},
						PJZZCS: {label: '平均周转次数'},
						PJYSSJ: {label: '平均营收时间'},
						PJDHSJ: {label: '平均等候时间'},
						PJYSQK: {label: '平均营收情况'},
						PJZLC: {label: '平均总里程'},
						PJSZLC: {label: '平均实载里程'},
						PJKSLC: {label: '平均空驶里程'}
					};
					statistics4Grid.set('columns', columns);
					$('#statistics4Table').show();
				});
				/*统计车辆*/
				query('#statistics4-tjcl').on('click', function () {
					columns = {
						dojoId: {label: '序号'},
						GS: {label: '公司'},
						CP: {label: '车牌'},
						YYCS: {label: '营运次数'},
						YYCLS: {label: '营运车辆数'},
						YYJE: {label: '营运金额'},
						SZLC: {label: '实载里程'},
						KSLC: {label: '空驶里程'},
						ZLC: {label: '总里程'},
						YSSC: {label: '营收时长'},
						PJZZCS: {label: '平均周转次数'},
						KSYYSJ: {label: '开始营运时间'},
						JSYYSJ: {label: '结束营运时间'},
						DHSJ: {label: '等候时间'}
					};
					statistics4Grid.set('columns', columns);
					$('#statistics4Table').show();
				});
				/*统计ATE*/
				query('#statistics4-tjate').on('click', function () {
					columns = {
						dojoId: {label: '序号'},
						GS: {label: '公司'},
						CP: {label: '车牌'},
						YYCS: {label: '营运次数'},
						YYCLS: {label: '营运车辆数'},
						YYJE: {label: '营运金额'},
						SZLC: {label: '实载里程'},
						KSLC: {label: '空驶里程'},
						ZLC: {label: '总里程'},
						YSSC: {label: '营收时长'},
						KSYYSJ: {label: '开始营运时间'},
						JSYYSJ: {label: '结束营运时间'},
						DHSJ: {label: '等候时间'}
					};
					statistics4Grid.set('columns', columns);
					$('#statistics4Table').show();
				});
				/*20-50统计*/
				query('#statistics4-2050tj').on('click', function () {
					columns = {
						dojoId: {label: '序号'},
						GS: {label: '公司'},
						CP: {label: '车牌'},
						RQ: {label: '日期'},
						YYCLS: {label: '营运车辆数'},
						ZZCS: {label: '周转次数'},
						DHSJ: {label: '等候时间'},
						YYQK: {label: '营运情况'},
						YYSJ: {label: '营运时间'},
						ZLC: {label: '总里程'},
						SZLC: {label: '实载里程'},
						KSLC: {label: '空驶里程'},
						SZL: {label: '实载率'},
						KSYYSJ: {label: '开始营运时间'},
						JSYYSJ: {label: '结束营运时间'}
					};
					statistics4Grid.set('columns', columns);
				});
				/*统计*/
				query('#statistics4-tj').on('click', function () {
					columns = {
						dojoId: {label: '序号'},
						GS: {label: '公司'},
						CP: {label: '车牌'},
						RQ: {label: '日期'},
						YYCLS: {label: '营运车辆数'},
						ZZCS: {label: '周转次数'},
						DHSJ: {label: '等候时间'},
						YYQK: {label: '营运情况'},
						YYSJ: {label: '营运时间'},
						ZLC: {label: '总里程'},
						SZLC: {label: '实载里程'},
						KSLC: {label: '空驶里程'},
						SZL: {label: '实载率'},
						KSYYSJ: {label: '开始营运时间'},
						JSYYSJ: {label: '结束营运时间'}
					};
					statistics4Grid.set('columns', columns);
				});
				/*导出*/
				query('#statistics4-dc').on('click', function () {});
			}
		})
	});