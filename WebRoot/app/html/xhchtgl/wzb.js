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
		var wzbGrid = null, store = null,count=0;
		var wzb_data;
		var columns = {
				checkbox: {label: '选择', renderCell: function (item) {
					var div = dc.create('div', {});
					dc.place(dc.create('input', {type: 'checkbox', name: 'gsb-tableCheckBox', id: item.COMP_ID, value:item.BA_ID}), div);
					return div;
				}},
				dojoId: {label: '序号'},
				PARTY_NAME: {label: '当事人姓名'},
				COM_NAME:{label: '公司名'},
				AUTO_NUM: {label: '车号'},
				INTEGRAL: {label: '扣分'},
				ILLEGAL_TIME: {label: '违章时间',formatter : util.formatYYYYMMDDHHMISS},
				CASE_REASON: {label: '案件原因'},
				ORGAN: {label: '执法部门'},
				AREA: {label: '执法区域'},
		};
		var xhrArgsTabel = {
			url : basePath + "xhchtgl/findwzxx",
			postData : 'postData={"page":1,"pageSize":30,"COM_NAME":'+$(".gsname-list").val()+'}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				layer.closeAll();
				wzb_data = data.datas;
				if(data.count>0){
					for (var i = 0; i < data.datas.length; i++) {
						data.datas[i] = dojo.mixin({
							dojoId : i + 1
						}, data.datas[i]);
					}
				}else{
					dijit.byId('qd_dialog').show().then(function() {
						$("#czjg").html('查询不到该信息！');
					});
				}
				store = new Memory({
					data : {
						identifier : 'dojoId',
						label : 'dojoId',
						items : data.datas
					}
				});
				wzbGrid.totalCount = data.count;
				wzbGrid.set('collection',store);
				wzbGrid.pagination.refresh(data.datas.length);
			
			},
			error : function(error) {
				console.log(error);
			}
		};
		var pageii = null;	
		

		return declare( null,{
			constructor:function(){
				this.initToolBar();
				if (wzbGrid) {
					wzbGrid = null;
					dojo.empty('wzbTabel')
				}
				wzbGrid = new CustomGrid({
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "wzbTabel");
				layer.load(1);
				pageii = new Pagination(wzbGrid,xhrArgsTabel,{"COM_NAME":$(".gsname-list").val()},30);
				dc.place(pageii.first(),'wzbTabel','after');
//				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
				var _self = this;
//				if (wzbGrid) { wzbGrid = null; dojo.empty('wzbTabel')};
//				wzbGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns}, 'wzbTabel');
				query('#wzbQuery').on('click', function () {
					layer.load(1);
					if (wzbGrid) {
						wzbGrid = null;
						dojo.empty('wzbTabel')
					}
					wzbGrid = new CustomGrid({
						totalCount : 0,
						pagination:null,
						columns : columns
					}, "wzbTabel");
					$(".pagination").remove();
					pageii = new Pagination(wzbGrid,xhrArgsTabel,{"COM_NAME":$(".gsname-list").val()},30);
					dc.place(pageii.first(),'wzbTabel','after');
//					pageii.first();
				});
				query('#wzbDc').on('click', function() {
					var postData = {
							"COM_NAME":$(".gsname-list").val(),
						};
						url = "backExcel/findwzxxexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
			}
		})
	});