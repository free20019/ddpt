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
		var statistics1Grid = null, statistics1QueryGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			XM: {label: '姓名'},
			JD: {label: '经度'},
			JD2: {label: '经度2'},
			WD: {label: '纬度'},
			WD2: {label: '维度2'}
		};
		var xhrArgsTabel = {
			url : basePath + "kb/querycl",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
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
				statistics1QueryGrid.totalCount = data.count;
				statistics1QueryGrid.set('collection', store);
				statistics1QueryGrid.pagination.refresh(data.data.length);
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
				if (statistics1QueryGrid) { statistics1QueryGrid = null; dojo.empty('statistics1-queryTable') }
				statistics1QueryGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'statistics1-queryTable');

				query('#statistics1-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#statistics1-endTime').trigger('focus')
						},
						dateFmt: STATETIME
					});
				});
				query('#statistics1-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATETIME});
				});
				query('#statistics1-yycsrq').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});

				query('#statistics1-queryNum').on('click', function () {
					var columns = {
						dojoId: {label: '序号'},
						XM: {label: '地址'},
						JD: {label: '数目'}
					};
					if (statistics1Grid) { statistics1Grid = null; dojo.empty('statistics1Table') }
					statistics1Grid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'statistics1Table');
					$('#statistics1Table').show();
				});
				/*查找明细*/
				query('#statistics1-czmx').on('click', function () {
					var columns = {
						dojoId: {label: '序号'},
						RZYYCS: {label: '日总营运次数'},
						YYCLS: {label: '营运车辆数'},
						RZXSLC: {label: '日总行驶里程'},
						RKSLC: {label: '日空驶里程'},
						RZKXSLC: {label: '日载客行驶里程'},
						RZYSJE: {label: '日总营收金额'},
						YYSC: {label: '营运时长'}
					};
					if (statistics1Grid) { statistics1Grid = null; dojo.empty('statistics1Table') }
					statistics1Grid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'statistics1Table');
					$('#statistics1Table').show();
				});
				/*营运次数*/
				query('#statistics1-yycs').on('click', function () {
					var columns = {
						dojoId: {label: '序号'},
						SM: {label: '数目'}
					};
					if (statistics1Grid) { statistics1Grid = null; dojo.empty('statistics1Table') }
					statistics1Grid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'statistics1Table');
					$('#statistics1Table').show();
				});
				/*调价跟踪*/
				query('#statistics1-djgz').on('click', function () {
					var columns = {
						dojoId: {label: '序号'},
						CP: {label: '车牌'},
						YYCS: {label: '营运次数'},
						DCYS: {label: '单车营收'},
						XSGLS: {label: '行驶公里数'},
						ZKGLS: {label: '载客公里数'},
						LCLYL: {label: '里程利用率'}
					};
					if (statistics1Grid) { statistics1Grid = null; dojo.empty('statistics1Table') }
					statistics1Grid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'statistics1Table');
					$('#statistics1Table').show();
				});
				/*英伦跟踪*/
				query('#statistics1-ylgz').on('click', function () {
					var columns = {
						dojoId: {label: '序号'},
						CP: {label: '车牌'},
						YYCS: {label: '营运次数'},
						DCYS: {label: '单车营收'},
						XSGLS: {label: '行驶公里数'},
						ZKGLS: {label: '载客公里数'},
						LCLYL: {label: '里程利用率'}
					};
					if (statistics1Grid) { statistics1Grid = null; dojo.empty('statistics1Table') }
					statistics1Grid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'statistics1Table');
					$('#statistics1Table').show();
				});
			}
		})
	});