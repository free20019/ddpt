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
		var khxxcxGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			CI_NAME: {label: '客户姓名'},
			CI_TEL: {label: '客户电话'},
			ADDRESS: {label: '客户地址'},
			ADDRES_REF: {label: '客户参考地址'},
			COMPL_NUM: {label: '投诉数量'},
			DISP_NUM: {label: '叫车总数'},
			SUCCESS_NUM: {label: '成功总数'},
			CI_GRADE: {label: '客户等级'},
			REC_TIME: {label: '最后叫车时间', formatter:util.formatYYYYMMDDHHMISS},
			NOTE: {label: '备注'}
		};
		var xhrArgsTabel = {
				url : basePath + "kb/querykhxx",
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
					khxxcxGrid.totalCount = data.length;
					khxxcxGrid.set('collection', store);
					$("#khxxts").html(data.length);
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
				if (khxxcxGrid) { khxxcxGrid = null; dojo.empty('khxxcxTabel') }
				khxxcxGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "khxxcxTabel");
				
				$("#khxx_stime").val(setformat1(new Date(new Date().getTime() - 1000 * 60 * 60*1)));
				$("#khxx_etime").val(setformat1(new Date()));
				
				query('#khxxcxbtn').on('click', function () {
					var postData = {};
					postData.cxgjz=$("#khxx_cxgjz").val();
					postData.stime=$("#khxx_stime").val();
					postData.etime=$("#khxx_etime").val();
					loading('#khxxcxTabel');
					dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
				});
				
				query('#khxxcxdaochubtn').on('click', function () {
					var postData = {};
					postData.cxgjz=$("#khxx_cxgjz").val();
					postData.stime=$("#khxx_stime").val();
					postData.etime=$("#khxx_etime").val();
					url = basePath + "kb/querykhxx_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		})
	});